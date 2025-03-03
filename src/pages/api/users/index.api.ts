import { prisma } from '@/lib/prisma'
import { setCookie } from 'nookies'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end() // status code: method not allowed
  }

  const { username, fullName } = req.body

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userAlreadyExists) {
    return res.status(400).json({
      message: 'Username already exists. Please, try another',
    })
  }

  const user = await prisma.user.create({
    data: {
      username,
      fullName,
    },
  })

  const second = 1
  const minuteInSeconds = second * 60
  const hourInSeconds = minuteInSeconds * 60
  const dayInSeconds = hourInSeconds * 24
  const weekInSeconds = dayInSeconds * 7

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: weekInSeconds,
    path: '/',
  })

  return res.status(201).json(user)
}
