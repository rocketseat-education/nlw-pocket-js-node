import { getUserLevelAndExperience } from '@/functions/get-user-level-and-experience'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticateHook } from '../hooks/auth'

export const getGamificationStatusRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/gamification/status',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['user'],
        operationId: 'getGamificationStatus',
        description: 'Get authenticated user gamification status',
        response: {
          200: z.object({
            experience: z.number(),
            level: z.number(),
            experienceToNextLevel: z.number(),
          }),
        },
      },
    },
    async request => {
      const userId = request.user.sub

      const { experience, level, experienceToNextLevel } =
        await getUserLevelAndExperience({ userId })

      return { experience, level, experienceToNextLevel }
    }
  )
}
