import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
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
    async () => {
      const { pendingGoals } = await getWeekPendingGoals()

      return { pendingGoals }
    }
  )
}
