import {Injectable} from '@nestjs/common';
import {IMailService} from './mail-service.interface';
import {PasswordRestoreKey} from '../models/password-restore-key.model';
import {User} from '../models/user.model';
import {RegisterKey} from '../models/register-key.model';
import {ConfigService} from '../../config/config.service';
import * as nodemailer from 'nodemailer';
import * as hbs from 'express-handlebars';

@Injectable()
export class MailService implements IMailService
{
    private transporter;

    private template;

    constructor(
        private readonly config: ConfigService
    ) {
        this.template = hbs.create({
            layoutsDir: __dirname + '/../templates',
            partialsDir: __dirname + '/../templates'
        });
    }

    private async getTransporter()
    {
        if (!this.transporter)
        {
            const host: string = this.config.get('MAIL_HOST');
            const port: number = this.config.get('MAIL_PORT');
            const user: string = this.config.get('MAIL_USER');
            const password: string = this.config.get('MAIL_PASSWORD');

            this.transporter = nodemailer.createTransport({
                host: host,
                port: port,
                secure: false,
                auth: {
                    user: user,
                    pass: password
                },
                dkim: {
                    domainName: this.config.get('OPENDIKIM_DOMAIN'),
                    keySelector: this.config.get('OPENDIKIM_SELECTOR'),
                    privateKey: this.config.get('OPENDIKIM_KEY')
                }
            });
        }

        return this.transporter;
    }

    async send(from: string, to: string, subject: string, body: string) {

        const transporter = await this.getTransporter();

        await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: body
        });
    }

    async sendPasswordRestoreLink(restoreKey: PasswordRestoreKey): Promise<void> {

        const link = this.getBaseUrl() + '/security/password-recovery/' + restoreKey.key;
        const body = await this.template.render(this.getTemplatePath('restore-password.html'), {
            link: link,
            user: restoreKey.user
        });

        await this.send(
            this.config.get('EMAIL_NO_REPLY'),
            restoreKey.user.email,
            'Quick Language Practice - Restore password',
            body
        );
    }

    async sendPasswordRestoreNotify(user: User): Promise<void> {
        return undefined;
    }

    async sendRegisterConfirmation(registerKey: RegisterKey): Promise<void> {

        const link = this.getBaseUrl() + '/security/register-confirm/' + registerKey.key;

        const body = await this.template.render(this.getTemplatePath('register-confirmation.html'), {
            link: link,
            user: registerKey.client
        });

        await this.send(
            this.config.get('EMAIL_NO_REPLY'),
            registerKey.client.email,
            'Welcome to Quick Language Practice',
            body
        );
    }

    getTemplatePath(name: string)
    {
        return __dirname + '/../templates/' + name;
    }

    getBaseUrl()
    {
        return 'https://' +  this.config.get('EMAIL_LINK_HOST');
    }
}
