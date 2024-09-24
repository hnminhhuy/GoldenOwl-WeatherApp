import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './subscriber.entity';
import { Repository } from 'typeorm';
import { error } from 'console';
import { MailService } from 'src/mail/mail.service';
import {v4 as uuidv4 } from 'uuid'

@Injectable()
export class SubscriberService {
    constructor(
        @InjectRepository(Subscriber)
        private subscriberRepository : Repository<Subscriber>,
        private mailService : MailService
    ) {}

    async addSubscriber(email: string, location: string) {
        const existedSubscriber = await this.subscriberRepository.findOne({where: {email: email}});
        if (existedSubscriber) throw new Error("Subscriber existed");

        const subscriber = this.subscriberRepository.create({id: uuidv4(), email, location});
        await this.subscriberRepository.save(subscriber);
        this.mailService.sendConfirmationEmail(email, subscriber.id)
        return subscriber;
    }

    async confirmSubscriber(id: string) {
        const subscriber = await this.subscriberRepository.findOne({where: {id}});
        if (!subscriber) {
            throw new Error("Subscriber not found!");
        }

        subscriber.confirmed = true;
        await this.subscriberRepository.save(subscriber);
    }

    async removeSubscriber(email: string) {
        const result = await this.subscriberRepository.delete({email});
        return result;
    }
}
