import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subscriber } from "./subscriber.entity";
import { SubscriberService } from "./subscriber.service";
import { SubscriberController } from "./subscriber.controller";
import { MailService } from "src/mail/mail.service";

@Module({
    imports: [TypeOrmModule.forFeature([Subscriber])],
    providers: [SubscriberService, MailService],
    controllers: [SubscriberController]
})
export class SubscriberModule {}
