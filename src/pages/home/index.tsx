import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'
import { NextSeo } from 'next-seo'

import previewHero from '../../assets/preview-hero.png'
import { ClaimUsernameForm } from './components/claim-username-form'
import { Container, Hero, Preview } from './styles'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            Agendamento descomplicado
          </Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>
          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={previewHero}
            height={400}
            quality={100}
            alt="Calendário simbolizando a aplicação em funcionamento"
            priority
          />
        </Preview>
      </Container>
    </>
  )
}
