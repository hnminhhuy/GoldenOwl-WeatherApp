import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const port = process.env.PORT || 4000
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get('ALLOWED_ORIGINS');

   // Enable CORS globally
    app.enableCors({
      origin: allowedOrigins.split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

  await app.listen(port);
}
bootstrap();
