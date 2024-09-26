import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 4000
  const app = await NestFactory.create(AppModule);

   // Enable CORS globally
   app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if needed for cookies or authentication
  });

  await app.listen(port);
}
bootstrap();
