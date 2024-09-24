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
            condition: res.forecast.forecastday[0].day.condition,
            maxtemp_c: res.forecast.forecastday[0].day.maxtemp_c,
            mintemp_c: res.forecast.forecastday[0].day.mintemp_c,
            avgtemp_c: res.forecast.forecastday[0].day.avgtemp_c,
            totalprecip_mm: res.forecast.forecastday[0].day.totalprecip_mm,
            maxwind_kph: res.forecast.forecastday[0].day.maxwind_kph,
            avghumidity: res.forecast.forecastday[0].day.avghumidity,
            uv: res.forecast.forecastday[0].day.uv,
            daily_chance_of_rain: res.forecast.forecastday[0].day.daily_chance_of_rain
        }
    }

    @Cron("30 23 * * *")
    async sendDailyForecastToAll() {
        const subscribers = await this.subscriberService.getAllConfirmedSubscriber();
        // Get unique City Names
        const uniqueCitites = [...new Set(subscribers.map(subscribers => subscribers.location))];

        const cityWeatherMap = new Map<string, any>();

        for (const city of uniqueCitites) {
            try {
                const response = await lastValueFrom(this.weatherService.getForecast(city, 1))
                const data = this.preprocessData(response);
                cityWeatherMap.set(city, data);
            } catch (error) {
                console.error(`Error fetching weather data for ${city}:`, error);
            }
        }

        for (const subscriber of subscribers) {
            const data = cityWeatherMap.get(subscriber.location);
            await this.emailService.sendDailyForecast(subscriber.email, data);
        }

    }
}
