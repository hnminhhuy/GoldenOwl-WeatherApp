import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(
        private mailerService : MailerService
    ) {}

    async sendDailyForecast(email: string, forecastData: any) {
        await this.mailerService.sendMail({
            to: email,
            subject: `Daily Weather Forecast for ${forecastData.city} - ${forecastData.country}`,
            template: 'daily_forecast',
            context: {
                date: forecastData.date,
                condition: forecastData.condition,
                temp: forecastData.temp,
                humidity: forecastData.humidity,
                wind: forecastData.wind
            }
        });
        console.log(`Sent daily email to ${email}`);
    }
}
