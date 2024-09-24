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

    @Post('unsubscribe')
    async unsubscribe(@Body('email') email: string) {
        return await this.subscriberService.removeSubscriber(email);
    }
}