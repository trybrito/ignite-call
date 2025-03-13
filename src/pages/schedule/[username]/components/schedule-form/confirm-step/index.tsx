import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '@/lib/axios'

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

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmScheduleFormData>({
    resolver: zodResolver(confirmSchedulingFormSchema),
  })

  const router = useRouter()
  const username = String(router.query.username)

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  async function handleConfirmScheduling(data: ConfirmScheduleFormData) {
    const { fullName, email, observations } = data

    await api.post(`/users/${username}/schedule`, {
      fullName,
      email,
      observations,
      date: schedulingDate,
    })

    onCancelConfirmation()
  }

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput
          placeholder="Seu nome"
          {...register('fullName')}
          crossOrigin={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
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
          crossOrigin={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
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
        <Button
          type="button"
          variant="tertiary"
          disabled={isSubmitting}
          onClick={onCancelConfirmation}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
