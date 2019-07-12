import { Model } from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Injectable} from '@nestjs/common';

@Injectable()
export class UserService
{
    constructor(@InjectModel('User') private readonly userModel: Model<any>) {}

    getByEmail(email: string)
    {

    }
}
