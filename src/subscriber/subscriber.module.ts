import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subscriber } from "./subscriber.entity";
import { SubscriberService } from "./subscriber.service";
import { SubscriberController } from "./subscriber.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Subscriber])],
    providers: [SubscriberService],
    controllers: [SubscriberController],
    exports: [SubscriberService]
})
export class SubscriberModule {}
