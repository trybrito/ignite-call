import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date was not provided.' })
  }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

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

  console.log(possibleSchedulingHours)

  const blockedSchedulingHours = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lt: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableSchedulingHours = possibleSchedulingHours.filter((hour) => {
    const isTimeBlocked = blockedSchedulingHours.some(
      (blockedHour) => blockedHour.date.getHours() === hour,
    )

    const isTimeInPast = referenceDate.set('hour', hour).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({ possibleSchedulingHours, availableSchedulingHours })
}
