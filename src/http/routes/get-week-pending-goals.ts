import { getWeekPendingGoals } from '@/app/functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', {}, async () => {
    const { pendingGoals } = await getWeekPendingGoals()

    return { pendingGoals }
  })
}
