import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';

@Injectable()
export class WeatherService {
    private apiKey : string
    private baseUrl : string
    constructor(
        private httpService : HttpService,
        private config : ConfigService
    ){
        this.apiKey = config.get<string>("WEATHER_API")
        this.baseUrl = config.get<string>("WEATHER_BASE_URL")
    }

    getForecast(city: string, days: Number) {
        console.log(`${this.baseUrl}/weather/forecast.json?q=${city}&days=${days}&key=${this.apiKey}`);
        return this.httpService
            .get(`${this.baseUrl}/weather/forecast.json?q=${city}&days=${days}&key=${this.apiKey}`)
            .pipe(
                map((res) => ({
                    location: {
                        name: res.data.location.name,
                        country: res.data.location.country,
                    },
                    current: {
                        temp_c: res.data.current.temp_c,
                        wind: res.data.current.wind_kph,
                        humidity: res.data.current.humidity,
                        condition: res.data.current.condition,
                    },
                    forecasts: res.data.forecast.forecastday.map(day => ({
                        date: day.date,
                        temp: day.day.avgtemp_c,
                        humidity: day.day.avghumidity,
                        wind: day.day.maxwind_kph,
                        condition: day.day.condition,
                    }))
                })),
                catchError((error) => {
                    if (error.response && error.response.data.status == 400) {
                        throw new HttpException(
                            {
                                status: HttpStatus.BAD_REQUEST,
                                message: error.response.data.message,
                                error: error.response.data.error,
                            },
                            HttpStatus.BAD_REQUEST
                        )
                    } else {
                        throw new HttpException(
                        {
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            error: error.message,
                        }, 
                        HttpStatus.INTERNAL_SERVER_ERROR)
                    }
                })
            );
    };

    search(query: string) {
        return this.httpService
            .get(`${this.baseUrl}/search.json?q=${query}&key=${this.apiKey}`)
            .pipe(
                map(cities => cities.data.map(city => ({
                    name: city.name,
                    id: city.id,
                    country: city.country
                }))),
                catchError((error) => {
                    if (error.response && error.response.status === 400) {
                        // Handle 400 error from the WeatherAPI
                        throw new HttpException(
                            {
                            status: HttpStatus.BAD_REQUEST,
                            error: error.response.data.message,
                            },
                            HttpStatus.BAD_REQUEST
                        );
                    } else {
                        // Handle any other errors
                        throw new HttpException(
                            {
                            status: HttpStatus.INTERNAL_SERVER_ERROR,
                            error: error.message,
                            },
                            HttpStatus.INTERNAL_SERVER_ERROR
                        );
                    }
                })
            );
    };
}
