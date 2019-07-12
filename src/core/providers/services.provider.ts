import {Provider} from '@nestjs/common';
import * as mongoose from 'mongoose';
import {ConfigService} from '../../config/config.service';
import {IMailService} from '../services/mail-service.interface';
import {MailDevService} from '../services/mail-dev.service';
import {MailService} from '../services/mail.service';

export const services: Provider[] = [
    {
        provide: 'DATABASE_CONNECTION',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
            const dbConfig = configService.getMongoConfig();
            return await mongoose.connect(dbConfig.uri, dbConfig.options);
        },
    },
    {
        provide: 'MAILER',
        inject: [ConfigService],
        useFactory: (configService: ConfigService): IMailService => {
            return configService.get('APP_ENV', 'dev') === 'dev' ? (new MailDevService()) : (new MailService());
        },
    },
];
