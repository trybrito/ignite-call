import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'

import previewHero from '../../assets/preview-hero.png'
import { ClaimUsernameForm } from './components/claim-username-form'
import { Container, Hero, Preview } from './styles'

export default function Home() {
  return (
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
  )
}
