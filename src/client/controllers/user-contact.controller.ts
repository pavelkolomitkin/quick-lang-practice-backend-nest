import {Controller, Delete, Get, Injectable, NotFoundException, Param, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {User as CurrentUser} from '../../core/decorators/user.decorator';
import {UserContact} from '../../core/models/user-contact.model';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {PageParamPipe} from '../../core/pipes/page-param.pipe';
import {UserContactService} from '../services/user-contact.service';
import {ClientUser} from '../../core/models/client-user.model';
import {DateTimePipe} from '../../core/pipes/date-time.pipe';

@Injectable()
@Controller('client/contact')
@UseGuards(AuthGuard())
export class UserContactController
{
    constructor(
        private service: UserContactService
    ) {}

    @Get('list')
    async getList(
        @CurrentUser() user,
        @Query('lastDate', DateTimePipe) lastDate: Date,
    )
    {
        const contacts = await this
            .service
            .getListQuery(user, {lastMessageAddedAt: lastDate})
            .populate('newMessages')
            .populate('addressee')
            .populate('lastMessage')
            .limit(10);
        return {
            contacts: contacts.map((item) => {

                const { newMessages, addressee, lastMessage } = item;

                return {
                  ...item.serialize(),
                    newMessages,
                    addressee: addressee.serialize(),
                    lastMessage: lastMessage ? lastMessage.serialize() : null
                }

            })
        };
    }

    @Get('new-message-number')
    async getNewMessageNumber(
        @CurrentUser() user,
    )
    {
        const result = await this.service.getNewMessageNumber(user);
        return {
            number: result
        };
    }

    @Get(':userId')
    async getContact(
        @Param('userId', new ParameterConverterPipe('ClientUser', 'id')) addressee: ClientUser,
        @CurrentUser() user,
    )
    {
        const contact = await this.service.getContact(user, addressee);
        if (!contact)
        {
            throw new NotFoundException();
        }

        return {
            contact: contact.serialize()
        };
    }

    @Delete(':id')
    async remove(
        @Param('id', new ParameterConverterPipe('UserContact', 'id')) contact: UserContact,
        @CurrentUser() user,
    )
    {
        try {
            await this.service.remove(contact, user);

            return {
                // @ts-ignore
                contact: contact.serialize()
            };
        }
        catch (error) {
            throw new NotFoundException();
        }
    }

    @Put(':id/read')
    async readLastMessages(
        @Param('id', new ParameterConverterPipe('UserContact', 'id')) contact: UserContact,
        @CurrentUser() user,
    )
    {
        try {
            await this.service.read(contact, user);
        }
        catch (error) {
            throw new NotFoundException();
        }
    }

}
