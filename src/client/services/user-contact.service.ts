import { Model } from 'mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {UserContact} from '../../core/models/user-contact.model';
import {User} from '../../core/models/user.model';
import {CoreException} from '../../core/exceptions/core.exception';
import {ContactMessage} from '../../core/models/contact-message.model';
import {async} from 'rxjs/internal/scheduler/async';
import {ProfileService} from './profile.service';

@Injectable()
export class UserContactService
{
    constructor(
        @Inject('UserContact') private readonly model: Model<UserContact>,
        @Inject('User') private readonly userModel: Model<User>,
        private readonly profileService: ProfileService
    ) {}

    getListQuery(user: User)
    {
        return this.model.find({
            user: user.id
        })
            .sort({'updatedAt': 0});

    }

    async getContact(user: User, addressee: User)
    {
        return await this.model.findOne({
            user: user.id,
            addressee: addressee.id
        });
    }

    async remove(contact: UserContact, owner: User)
    {
        if (contact.user !== owner.id)
        {
            throw new CoreException();
        }

        // @ts-ignore
        await contact.remove();
    }

    async create(user: User, addressee: User)
    {
        let isBlocked = await this.profileService.isAddresseeBlocked(user, addressee);
        if (isBlocked)
        {
            throw new CoreException();
        }

        let result = await this.model.findOne({
            user: user,
            addressee: addressee
        });

        if (!result)
        {
            result = new this.model({
                user: user,
                addressee: addressee
            });

            await result.save();
        }


        return result;
    }

    async removeNewMessageFromContacts(message: ContactMessage)
    {
        await this.model.update(
            {
              _id: { $in: message.contacts }
            },
            { $pull: { newMessages: { _id: message.id } } }
            );
    }

    async removeLastMessageFromContacts(message: ContactMessage)
    {
        await this.model.update(
            {
                _id: {$in: message.contacts},
                lastMessage: message.id
            },
            {
                lastMessage: null
            }
        );
    }

    async read(contact: UserContact, owner: User)
    {
        if (contact.user !== owner.id)
        {
            throw new CoreException();
        }

        contact.newMessages = [];

        // @ts-ignore
        await contact.save();
    }

    async getMessageContacts(message: ContactMessage)
    {
        const populated: ContactMessage = await this.model.populate(message, { path: 'contacts' });

        return populated.contacts;
    }
}
