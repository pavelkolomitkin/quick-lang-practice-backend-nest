import { Model } from 'mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {UserContact} from '../../core/models/user-contact.model';
import {User} from '../../core/models/user.model';
import {CoreException} from '../../core/exceptions/core.exception';
import {ContactMessage} from '../../core/models/contact-message.model';

@Injectable()
export class UserContactService
{
    constructor(
        @Inject('UserContact') private readonly model: Model<UserContact>,
        @Inject('User') private readonly userModel: Model<User>
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

    async isAddresseeBlocked(user: User, addressee: User)
    {
        return !!await this.userModel.findOne({
            _id: user.id,
            blackList: addressee
        });
    }

    async blockContact(contact: UserContact, user: User)
    {
        await this.userModel.populate('addressee', contact);

        const isBlocked = await this.isAddresseeBlocked(user, contact.addressee);

        if (!isBlocked)
        {
            await this.userModel.updateOne(
                {
                    _id: user.id,
                },
                {
                    $push: { blackList: contact.addressee }
                });
        }
    }

    async unBlockContact(contact: UserContact, user: User)
    {
        await this.userModel.populate('addressee', contact);

        const isBlocked = await this.isAddresseeBlocked(user, contact.addressee);

        if (isBlocked)
        {
            await this.userModel.updateOne(
                {
                    _id: user.id
                },
                {
                    $pull: { blackList: contact.addressee }
                }
            );
        }
    }

    async create(user: User, addressee: User)
    {
        let isBlocked = await this.isAddresseeBlocked(addressee, user);
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
}
