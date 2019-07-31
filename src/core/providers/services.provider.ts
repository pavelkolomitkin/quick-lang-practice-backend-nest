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

            await mongoose.connect(dbConfig.uri, dbConfig.options);
            // try {
            //     await mongoose.connect('mongodb://mongodb-service:27017/qlp_practice', {
            //         useNewUrlParser: true,
            //         replicaSet: 'rs_qlp'
            //     });
            //
            // }
            // catch (e) {
            //     debugger
            //     console.log(e);
            //     throw e;
            // }

            mongoose.set('toJSON', { virtuals: true });
            mongoose.set('toObject', { virtuals: true });

            return mongoose;
        },
    },
    {
        provide: 'MAILER',
        inject: [ConfigService],
        useFactory: (configService: ConfigService): IMailService => {
            return configService.get('APP_ENV', 'dev') === 'dev' ? (new MailDevService()) : (new MailService(configService));
        },
    },
];
