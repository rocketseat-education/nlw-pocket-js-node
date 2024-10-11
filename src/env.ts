import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
