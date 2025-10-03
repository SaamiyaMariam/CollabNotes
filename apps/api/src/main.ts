import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  // Check critical env vars early
  ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'].forEach((key) => {
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
