import { Model, Types } from 'mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {UserContact} from '../../core/models/user-contact.model';
import {User} from '../../core/models/user.model';
import {CoreException} from '../../core/exceptions/core.exception';
import {ContactMessage} from '../../core/models/contact-message.model';
import {ProfileService} from './profile.service';

@Injectable()
export class UserContactService
{
    constructor(
        @Inject('UserContact') private readonly model: Model<UserContact>,
        @Inject('User') private readonly userModel: Model<User>,
        private readonly profileService: ProfileService
    ) {}

    getListQuery(user: User, criteria: any)
    {
        const filter = {
            user: user.id
        };

        this.handleLastMessageAddedAt(filter, criteria);

        return this
            .model
            .find(filter)
            .sort({'lastMessageAddedAt': -1});
    }

    private handleLastMessageAddedAt(filter: any, criteria: any)
    {
        if (criteria.lastMessageAddedAt)
        {
            filter.lastMessageAddedAt = {
                $lt: criteria.lastMessageAddedAt
            };
        }
    }

    async getContact(user: User, addressee: User)
    {
        return await this.model.findOne({
            user: user.id.toString(),
            addressee: addressee.id.toString()
        });
    }

    async remove(contact: UserContact, owner: User)
    {
        if (contact.user.toString() !== owner.id)
        {
            throw new CoreException();
        }

        // @ts-ignore
        await contact.delete();
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
              _id: { $in: message.contacts.map(item => new Types.ObjectId(item.id)) }
            },
            { $pull: { newMessages: new Types.ObjectId(message.id) } },
            { multi: true }
            );
    }

    async removeLastMessageFromContacts(message: ContactMessage)
    {
        await this.model.update(
            {
                _id: {$in: message.contacts.map(item => new Types.ObjectId(item.id))},
                lastMessage: new Types.ObjectId(message.id)
            },
            {
                lastMessage: null
            },
            { multi: true }
        );
    }

    async read(contact: UserContact, owner: User)
    {
        if (contact.user.toString() !== owner.id)
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

    async getNewMessageNumber(user: User)
    {
        const data = await this.model.aggregate([
            {
                $match: {
                    user: new Types.ObjectId(user.id)
                }
            },

            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $size: '$newMessages'
                        }
                    }
                }
            }
        ]);

        let result = 0;
        if (data.length > 0)
        {
            result = data[0].total ? data[0].total : 0
        }

        return result;
    }
}
