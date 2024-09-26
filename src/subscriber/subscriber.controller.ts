import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SubscriberService } from "./subscriber.service";

@Controller('subscribe')
export class SubscriberController {
    constructor(private readonly subscriberService : SubscriberService) {}

    @Post()
    async subscribe(@Body() body: {email: string, location: string}) {
        const { email, location } = body;
        return await this.subscriberService.addSubscriber(email, location);
    }

    @Get('confirm')
    async confirm(@Query('key') key : string) {
        return await this.subscriberService.confirmSubscriber(key);
    }

    @Get('requestUnsubscribe')
    async reqUnsubscribe(@Query('email') email: string) {
        return await this.subscriberService.unsubscribingRequest(email);
    }


    @Get('unsubscribe')
    async unsubscribe(@Query('uid') uid: string) {
        try {
            const res = await this.subscriberService.removeSubscriber(uid);
            return {message: "Unsubscribe successfully!"};
        } catch(error) {
            return { error }
        }  
    }
}