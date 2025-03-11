import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'

const confirmSchedulingFormSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'O nome precisa ter ao menos 3 letras' }),
  email: z.string().email({
    message: 'Digite um e-mail válido',
  }),
  observations: z.string().nullable(),
})

type ConfirmScheduleFormData = z.infer<typeof confirmSchedulingFormSchema>

export function ConfirmStep() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmScheduleFormData>({
    resolver: zodResolver(confirmSchedulingFormSchema),
  })

  async function handleConfirmScheduling(data: ConfirmScheduleFormData) {
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve()
      }, 1000),
    )
  }

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          22 de Setembro de 2022
        </Text>
        <Text>
          <Clock />
          18:00
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('fullName')} />
        {errors.fullName && (
          <FormError size="sm">{errors.fullName.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
