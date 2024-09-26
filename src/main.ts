import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 4000
  const app = await NestFactory.create(AppModule);

   // Enable CORS globally
   app.enableCors({
    origin: ['https://golden-owl-weather-app-ui.vercel.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  await app.listen(port);
}
bootstrap();
