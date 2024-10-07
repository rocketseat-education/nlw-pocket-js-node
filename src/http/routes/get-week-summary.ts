import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getWeekSummary } from '../../functions/get-week-summary'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/summary',
    {
      schema: {
        tags: ['goals'],
        operationId: 'getWeekSummary',
        description: 'Get completed goals in a specific week',
        response: {
          200: z.object({
            summary: z.object({
              completed: z.number(),
              total: z.number(),
              goalsPerDay: z.record(
                z.string(),
                z.array(
                  z.object({
                    id: z.string(),
                    title: z.string(),
                    completedAt: z.string(),
                  })
                )
              ),
            }),
          }),
        },
      },
    },
    async () => {
      const { summary } = await getWeekSummary()

      return { summary }
    }
  )
}
