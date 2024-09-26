import { Controller, Query, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(private weatherService : WeatherService) {}

    @Get('forecast')
    getForecast(@Query('city') city : string, @Query('days') days : number) {
        return this.weatherService.getForecast(city, days);
    }

    @Get('search')
    searchLocation(@Query('city') city: string) {
        return this.weatherService.search(city);
    }
}
