import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { EmailService } from 'src/email/email.service';
import { SubscriberService } from 'src/subscriber/subscriber.service';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class EmailSchedulerService {
    static configService : ConfigService;
    constructor(
        private readonly emailService: EmailService,
        private readonly weatherService: WeatherService,
        private readonly subscriberService: SubscriberService,
    ) {}

    private preprocessData(res) {
        return {
           city: res.location.name,
           country: res.location.country,
           date: res.forecasts[0].date, 
           condition: res.forecasts[0].condition, 
           temp: res.forecasts[0].temp,
           humidity: res.forecasts[0].humidity,
           wind: res.forecasts[0].wind,
        }
    }

    @Cron("0 8 * * *")
    async sendDailyForecastToAll() {
        console.log("Sending daily forecast!")
        const subscribers = await this.subscriberService.getAllConfirmedSubscriber();
        // Get unique City Names
        const uniqueCitites = [...new Set(subscribers.map(subscribers => subscribers.location))];

        const cityWeatherMap = new Map<string, any>();

        for (const city of uniqueCitites) {
            try {
                const response = await lastValueFrom(this.weatherService.getForecast(`id:${city}`, 1))
                const data = this.preprocessData(response);
                cityWeatherMap.set(city, data);
            } catch (error) {
                console.error(`Error fetching weather data for ${city}:`, error);
            }
        }

        for (const subscriber of subscribers) {
            const data = cityWeatherMap.get(subscriber.location);
            await this.emailService.sendDailyForecast(subscriber.email, data);
            console.log(`Sent to ${subscriber.email}`)
        }

    }
}
