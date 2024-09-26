import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather/weather.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { strict } from 'assert';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './email/email.service';
import { EmailSchedulerService } from './email_scheduler/email_scheduler.service';
import { SubscriberService } from './subscriber/subscriber.service';
import { WeatherController } from './weather/weather.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    DatabaseModule,
    MailerModule.forRootAsync({
      useFactory: async (configService : ConfigService) => ({
        transport: {
            host: configService.get("MAIL_HOST"),
            port: configService.get("MAIL_PORT"),
            secure: false,
            auth: {
                user: configService.get("MAIL_USER"),
                pass: configService.get("MAIL_PASS"),
            }
        },
        defaults: {
          from: `"No Reply" <${configService.get("MAIL_USER")}>`
        },
        template: {
          dir: join(__dirname, 'src/templates/mails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        }
      }),
      inject: [ConfigService]
    }),
    SubscriberModule,
  ],
  controllers: [AppController, WeatherController],
  providers: [AppService, WeatherService, EmailService, EmailSchedulerService],
})
export class AppModule {}
