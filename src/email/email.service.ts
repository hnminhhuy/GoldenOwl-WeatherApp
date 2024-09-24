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
            subject: `Daily Weather Forecast for ${forecastData.city}`,
            template: 'daily_forecast',
            context: {
                condition: forecastData.condition,
                maxtemp_c: forecastData.maxtemp_c,
                mintemp_c: forecastData.mintemp_c,
                avgtemp_c: forecastData.avgtemp_c,
                totalprecip_mm: forecastData.totalprecip_mm,
                maxwind_kph: forecastData.maxwind_kph,
                avghumidity: forecastData.avghumidity,
                uv: forecastData.uv,
                daily_chance_of_rain: forecastData.daily_chance_of_rain
            }
        });
        console.log(`Sent daily email to ${email}`);
    }
}
