import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';
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

    getCurrent(city: string) {
        return this.httpService
            .get(`${this.baseUrl}/current.json?key=${this.apiKey}&q=${city}`)
            .pipe(
                map((res) => res.data),
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
                        error: 'An error occurred while fetching weather data',
                        },
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                    }
                })
            );
    }

    getForecast(city: string, days: Number) {
        return this.httpService
            .get(`${this.baseUrl}/forecast.json?q=${city}&days=${days}&key=${this.apiKey}`)
            .pipe(
                map((response) => response.data),
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
                        error: 'An error occurred while fetching weather data',
                        },
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                    }
                })
            );
    }

    search(query: string) {
        return this.httpService
            .get(`${this.baseUrl}/search?q=${query}&key=${this.apiKey}`)
            .pipe(
                map((response) => response.data),
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
                            error: 'An error occurred while fetching weather data',
                            },
                            HttpStatus.INTERNAL_SERVER_ERROR
                        );
                    }
                })
            );
    }
}
