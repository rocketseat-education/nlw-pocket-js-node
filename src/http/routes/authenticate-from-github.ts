import { authenticateFromGithubCode } from '@/functions/authenticate-from-github-code'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const authenticateFromGithubRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/auth/github',
    {
      schema: {
        tags: ['auth'],
        operationId: 'authenticateFromGithub',
        description: 'Authenticate from GitHub code',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({ token: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const { token } = await authenticateFromGithubCode({
        code,
      })

      return reply.status(201).send({ token })
    }
  )
}
