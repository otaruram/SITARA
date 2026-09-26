import { config } from 'dotenv';
config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY as string,
  SUMOPOD_API_KEY: process.env.SUMOPOD_API_KEY as string,
  IMAGEKIT: {
    PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY as string,
    PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY as string,
    URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT as string,
  }
};
