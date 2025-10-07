import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {

  const envPath = resolve(__dirname, '../../../../.env');
  console.log('Resolved .env path:', envPath, 'Exists:', existsSync(envPath));

  dotenv.config({ path: envPath });

  console.log('JWT_ACCESS_SECRET after load:', process.env.JWT_ACCESS_SECRET);

  // Check critical env vars early
  ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'].forEach((key) => {
    console.log('Loaded JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET);

    if (!process.env[key]) {
      throw new Error(`❌ Missing env var: ${key}`);
    }
  });

  const app = await NestFactory.create(AppModule);

  // Our single body parser (covers GraphQL too)
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: false }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 API running at http://localhost:${process.env.PORT ?? 3000}/graphql`);
}
bootstrap();
