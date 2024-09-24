import { Controller, Query, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(private weatherService : WeatherService) {}

    @Get("current")
    getCurrentWeather(@Query('city') city : string) {
        return this.weatherService.getCurrent(city);
    }

    @Get('forecast')
    getForecast(@Query('city') city : string, @Query('days') days : number) {
        return this.weatherService.getForecast(city, days)
    }
}
