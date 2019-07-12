import { Document } from 'mongoose';
import {ClientUser} from './client-user.model';

export interface RegisterKey extends Document {

    key: string;

    client: ClientUser;

    createdAt: string;

    updatedAt: string;

}
