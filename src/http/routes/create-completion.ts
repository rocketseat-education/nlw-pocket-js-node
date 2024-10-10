import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createGoalCompletion } from '../../functions/create-goal-completion'
import { authenticateHook } from '../hooks/auth'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['completions'],
        operationId: 'createCompletion',
        description: 'Complete a goal',
        body: z.object({
          goalId: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { goalId } = request.body

      await createGoalCompletion({
        goalId,
      })

      return reply.status(201).send()
    }
  )
}
