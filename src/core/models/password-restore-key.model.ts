import { Document } from 'mongoose';
import {User} from './user.model';

export interface PasswordRestoreKey extends Document {

    key: string;

    user: User;

    createdAt: string;

    updatedAt: string;

}
