import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: process.env.DATABASE_URL!,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
});
