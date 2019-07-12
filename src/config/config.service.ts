import { Injectable } from '@nestjs/common';
import * as mongoConfig from './mongo-config.js';

@Injectable()
export class ConfigService {

    public get(key: string, defaultValue: any = null): any
    {
        return process.env[key] || defaultValue;
    }

    public getMongoConfig(): { uri: string, options: any }
    {
        return mongoConfig;
    }

}
