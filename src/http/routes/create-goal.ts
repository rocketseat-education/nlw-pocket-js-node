import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createGoal } from '../../functions/create-goal'

export const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        tags: ['goals'],
        operationId: 'createGoal',
        description: 'Create a goal',
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { title, desiredWeeklyFrequency } = request.body

      await createGoal({
        title,
        desiredWeeklyFrequency,
      })

      return reply.status(201).send()
    }
  )
}
