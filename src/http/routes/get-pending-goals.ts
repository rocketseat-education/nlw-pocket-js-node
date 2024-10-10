import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'
import { authenticateHook } from '../hooks/auth'

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['goals'],
        operationId: 'getPendingGoals',
        description: 'Get pending goals',
        response: {
          200: z.object({
            pendingGoals: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                desiredWeeklyFrequency: z.number(),
                completionCount: z.number(),
              })
            ),
          }),
        },
      },
    },
    async request => {
      const userId = request.user.sub
      const { pendingGoals } = await getWeekPendingGoals({ userId })

      return { pendingGoals }
    }
  )
}
