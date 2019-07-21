import {Controller, Delete, Get, Injectable, NotFoundException, Param, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {User as CurrentUser} from '../../core/decorators/user.decorator';
import {UserContact} from '../../core/models/user-contact.model';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {PageParamPipe} from '../../core/pipes/page-param.pipe';
import {UserContactService} from '../services/user-contact.service';
import {ClientUser} from '../../core/models/client-user.model';

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
        @Query('page', PageParamPipe) page: number = 1
    )
    {
        const contacts = await this
            .service
            .getListQuery(user)
            .populate('newMessages')
            .populate('addressee')
            .populate('lastMessage')
            .skip(page * 10).limit(10);

        return {
            contacts: contacts.map(item => item.serialize())
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

    @Put(':id/:state')
    async changeBlockStatus(
        @Param('id', new ParameterConverterPipe('UserContact', 'id')) contact: UserContact,
        @Param('state') state: number,
        @CurrentUser() user,
    )
    {
        const isBlocking = Boolean(state);
        if (isBlocking)
        {
            await this.service.blockContact(contact, user);
        }
        else
        {
            await this.service.unBlockContact(contact, user);
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
