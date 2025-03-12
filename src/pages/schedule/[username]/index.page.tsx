import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import { prisma } from '@/lib/prisma'

import { ScheduleForm } from './components/schedule-form'
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
    <>
      <NextSeo title={`Agendar com ${user.fullName} | Ignite Call`} />
      {/* Open Graph Image (Satori, Vercel Open Graph Image Generation) */}

      <Container>
        <UserHeader>
          <Avatar src={user.avatarUrl} />
          <Heading>{user.fullName}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>
        <ScheduleForm />
      </Container>
    </>
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
