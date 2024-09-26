import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        if (existedSubscriber) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: "Subsrciber existed!",
                },
                HttpStatus.BAD_REQUEST
            )
        }

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
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: "Subscriber not found!",
                },
                HttpStatus.BAD_REQUEST
            )
        }
        subscriber.confirmed = true;
        this.subscriberRepository.save(subscriber);
        return "Confirm successfully!"
    }

    async unsubscribingRequest(email: string) {
        const subscriber = await this.subscriberRepository.findOne({where: {email: email}});
        if (!subscriber) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: "Subscriber not found!"
            }, HttpStatus.BAD_REQUEST)
        } else {
            const unsubscriptionLink = `${this.configService.get("HOST")}/subscribe/unsubscribe?uid=${subscriber.id}`;
            await this.mailerService.sendMail({
                to: email,
                subject: 'GoldenO Weather -  Unsubscribe resquest',
                template: 'unsubscribing',
                context: {
                    unsubscriptionLink: unsubscriptionLink
                }
            });
            return {
                status: HttpStatus.OK,
                message: "Sent unsubscribing email successfully!"
            }
        }
    }

    async removeSubscriber(uid: string) {
        const result = await this.subscriberRepository.delete({id: uid});
        if (result.affected > 0) {
            return { success: true, message: 'Subscriber removed successfully.' };
        } else {
            return { success: false, message: 'Subscriber not found or already removed.' };
        }
    }

    async getAllConfirmedSubscriber() {
        const res = await this.subscriberRepository.find({where: {confirmed: true}});
        return res;
    }
}
