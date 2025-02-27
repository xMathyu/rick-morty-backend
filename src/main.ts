import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

async function bootstrap() {
  console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT || 8080;
  await app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}
bootstrap();
