import {Inject, Injectable} from '@nestjs/common';
import {ClientUser} from '../../core/models/client-user.model';
import { Model } from 'mongoose';

@Injectable()
export class ClientUserService
{
    constructor(@Inject('ClientUser') private readonly model: Model<ClientUser>) {}
}
