import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather/weather.service';
import { ConfigModule } from '@nestjs/config';
import { WeatherController } from './weather/weather.controller';
import { DatabaseModule } from './database/database.module';
import { SubscriberService } from './subscriber/subscriber.service';
import { MailService } from './mail/mail.service';
import { SubscriberModule } from './subscriber/subscriber.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    HttpModule,
    DatabaseModule,
    SubscriberModule
  ],
  controllers: [AppController, WeatherController],
  providers: [AppService, WeatherService, MailService],
})
export class AppModule {}
