import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prisma'

dayjs.extend(utc)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date, timezoneOffset } = req.query

  if (!date || !timezoneOffset) {
    return res
      .status(400)
      .json({ message: 'Date or timezoneOffset not provided.' })
  }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  const timezoneOffsetInHours =
    typeof timezoneOffset === 'string'
      ? Number(timezoneOffset) / 60
      : Number(timezoneOffset[0]) / 60

  const referenceDateTimezoneOffsetInHours =
    referenceDate.toDate().getTimezoneOffset() / 60

  if (isPastDate) {
    return res.json({
      possibleSchedulingHours: [],
      availableSchedulingHours: [],
    })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({
      possibleSchedulingHours: [],
      availableSchedulingHours: [],
    })
  }

  const {
    start_time_in_minutes: startTimeInMinutes,
    end_time_in_minutes: endTimeInMinutes,
  } = userAvailability

  const startHour = startTimeInMinutes / 60
  const endHour = endTimeInMinutes / 60

  const possibleSchedulingHours = Array.from({
    length: endHour - startHour,
  }).map((_, i) => {
    return startHour + i
  })

  const blockedSchedulingHours = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate
          .set('hour', startHour)
          .add(timezoneOffsetInHours, 'hours')
          .toDate(),
        lte: referenceDate
          .set('hour', endHour)
          .add(timezoneOffsetInHours, 'hours')
          .toDate(),
      },
    },
  })

  const availableSchedulingHours = possibleSchedulingHours.filter((hour) => {
    const isTimeBlocked = blockedSchedulingHours.some(
      (blockedHour) =>
        blockedHour.date.getUTCHours() - timezoneOffsetInHours === hour,
    )

    const isTimeInPast = referenceDate
      .set('hour', hour)
      .subtract(referenceDateTimezoneOffsetInHours, 'hours')
      .isBefore(dayjs().utc().subtract(timezoneOffsetInHours, 'hours'))

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({ possibleSchedulingHours, availableSchedulingHours })
}
