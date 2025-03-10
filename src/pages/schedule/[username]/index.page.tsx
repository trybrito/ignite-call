import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'

import { prisma } from '@/lib/prisma'

import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    fullName: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.fullName}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>
    </Container>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return {
      notFound: true,
    }
  }

  const second = 1
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24

  return {
    props: {
      user: {
        fullName: user.full_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: day,
  }
}
