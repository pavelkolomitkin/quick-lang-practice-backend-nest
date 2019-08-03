import { Injectable } from '@nestjs/common';
import * as mongoConfig from './mongo-config.js';
import { config as thumb } from './thumb';


@Injectable()
export class ConfigService {

    env: any;

    constructor() {
        this.env = {...process.env};
    }

    public get(key: string, defaultValue: any = null): any
    {
        return this.env[key] || defaultValue;
    }

    public getMongoConfig(): { uri: string, options: any }
    {
        return mongoConfig;
    }

    public getThumbConfig()
    {
        return thumb;
    }
}
