import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './subscriber.entity';
import { Repository } from 'typeorm';
import { error } from 'console';
import {v4 as uuidv4 } from 'uuid'
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriberService {
    constructor(
        @InjectRepository(Subscriber)
        private subscriberRepository : Repository<Subscriber>,
        private mailerService : MailerService,
        private readonly configService : ConfigService
    ) {}

    async addSubscriber(email: string, location: string) {
        const existedSubscriber = await this.subscriberRepository.findOne({where: {email: email}});
        if (existedSubscriber) throw new Error("Subscriber existed");

        const subscriber = this.subscriberRepository.create({id: uuidv4(), email, location});
        await this.subscriberRepository.save(subscriber);
        const confirmationLink = `${this.configService.get("HOST")}/subscribe/confirm?key=${subscriber.id}`;
        await this.mailerService.sendMail({
            to: email,
            subject: 'GoldenO Weather -  Confirm Your Subscription',
            template: 'confirmation_email',
            context: {
                confirmationLink: confirmationLink
            }
        });
        return subscriber;
    }

    async confirmSubscriber(id: string) {
        const subscriber = await this.subscriberRepository.findOne({where: {id}});
        if (!subscriber) {
            throw new Error("Subscriber not found!");
        }
        subscriber.confirmed = true;
        this.subscriberRepository.save(subscriber);
        return "Confirm successfully!"
    }

    async removeSubscriber(uid: string) {
        const result = await this.subscriberRepository.delete({id: uid});
        return result;
    }

    async getAllConfirmedSubscriber() {
        const res = await this.subscriberRepository.find({where: {confirmed: true}});
        return res;
    }
}
