import { Model } from 'mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {ContactMessage} from '../../core/models/contact-message.model';
import {UserContact} from '../../core/models/user-contact.model';
import {ContactMessageDto} from '../dto/contact-message.dto';
import {User} from '../../core/models/user.model';
import {UserContactService} from './user-contact.service';
import {CoreException} from '../../core/exceptions/core.exception';
import {ContactMessageLog} from '../../core/models/contact-message-log.model';
import {ContactMessageLogActions} from '../../core/schemas/contact-message-log.schema';

@Injectable()
export class ContactMessageService
{
    constructor(
        @Inject('ContactMessage') private readonly model: Model<ContactMessage>,
        @Inject('ContactMessageLog') private readonly logModel: Model<ContactMessageLog>,
        private contactService: UserContactService
    ) {}

    getListQuery(contact: UserContact, owner: User)
    {
        if (contact.user.toString() !== owner.id)
        {
            throw new CoreException();
        }


        return this.model.find({
            contacts: contact.id
        })
            .sort({'createdAt': 0});
    }

    async create(data: ContactMessageDto, addressee: User, user: User)
    {
        let addresseeContact;
        try {
            addresseeContact = await this.contactService.create(addressee, user);
        }
        catch (error) {
            error.message = 'The user has blocked you!';
            throw error;
        }

        let userContact;
        try {
            userContact = await this.contactService.create(user, addressee);
        }
        catch (error) {
            error.message = 'You has blocked the user!';
            throw error;
        }

        // create a new message
        const result = new this.model({
            text: data.text,
            author: user,
            contacts: [
                addresseeContact.id,
                userContact.id
            ]
        });

        await result.save();

        addresseeContact.newMessages.push(result);
        addresseeContact.lastMessage = result;
        await addresseeContact.save();

        userContact.lastMessage = result;
        await userContact.save();

        const log = new this.logModel({
            message: result,
            addressee: addressee,
            action: ContactMessageLogActions.ADD
        });

        await log.save();

        return result;
    }

    async update(data: ContactMessageDto, message: ContactMessage, owner: User)
    {
        if (message.author !== owner.id)
        {
            throw new CoreException();
        }

        message.text = data.text;

        // @ts-ignore
        await message.save();

        return message;
    }

    async remove(message: ContactMessage, owner: User)
    {
        if (message.author !== owner.id)
        {
            throw new CoreException();
        }

        await this.contactService.removeNewMessageFromContacts(message);
        await this.contactService.removeLastMessageFromContacts(message);

        // @ts-ignore
        await message.remove();
    }

    async read()
    {

    }
}
