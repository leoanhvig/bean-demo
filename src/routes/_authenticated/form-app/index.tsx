import { createFileRoute } from '@tanstack/react-router'
import FormApp from '@/features/form-app'

export const Route = createFileRoute('/_authenticated/form-app/')({
  component: FormApp,
})
