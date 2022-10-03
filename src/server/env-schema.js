const { z } = require("zod");

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_CLIENT_SECRET: z.string(),
  AUTH0_ISSUER: z.string(),
});

module.exports.envSchema = envSchema;
