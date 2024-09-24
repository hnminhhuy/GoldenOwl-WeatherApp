import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'
import { from } from 'rxjs';

@Injectable()
export class MailService {
    private transport;
    constructor(
        private configService : ConfigService
    ) {
        this.transport = nodemailer.createTransport({
            host: this.configService.get("MAIL_HOST"),
            port: this.configService.get("MAIL_PORT"),
            secure: false,
            auth: {
                user: this.configService.get("MAIL_USER"),
                pass: this.configService.get("MAIL_PASS"),
            }
        })
    }

    async sendConfirmationEmail(email: string, id: string) {
        const confirmationLink = `http://localhost:3000/subscribe/confirm?key=${id}`;
        const mailOption = {
            from: this.configService.get("MAIL_USER"),
            to: email,
            subject: "Confirm your subscription of GoldenO-Weather",
            text: `Please confirm your subscription by clicking on this link: ${confirmationLink}`
        }

        return this.transport.sendMail(mailOption);
    }
}
