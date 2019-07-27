import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {UserContact} from '../../core/models/user-contact.model';
import {AuthGuard} from '@nestjs/passport';
import {User as CurrentUser} from '../../core/decorators/user.decorator';
import {ContactMessage} from '../../core/models/contact-message.model';
import {User} from '../../core/models/user.model';
import {ContactMessageDto} from '../dto/contact-message.dto';
import {ContactMessageService} from '../services/contact-message.service';
import {DateTimePipe} from '../../core/pipes/date-time.pipe';

@Controller('client/message')
@UseGuards(AuthGuard())
export class ContactMessageController
{
    constructor(
        private service: ContactMessageService
    ) {}

    @Get(':id/list')
    async getContactMessages(
        @Param('id', new ParameterConverterPipe('UserContact', 'id')) contact: UserContact,
        @CurrentUser() user,
        @Query('lastDate', DateTimePipe) lastDate: Date
    )
    {
        try {
            const messages = await this
                .service
                .getListQuery(contact, user, {
                    lastDate
                })
                .populate('author')
                .limit(20);

            return {
                messages: messages.map((message) => {

                    const author = message.author.serialize();
                    return {
                        ...message.serialize(),
                        author
                    }
                })
            };
        }
        catch (error) {
            throw new BadRequestException();
        }
    }

    @Post(':addressee')
    async create(
        @Param('addressee', new ParameterConverterPipe('User', 'id')) addressee: User,
        @CurrentUser() user,
        @Body() data: ContactMessageDto
    )
    {
        try {
            const message = await this.service.create(data, addressee, user);
            return {
                message: { ...message.serialize(), author: user.serialize() }
            }
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put(':id')
    async update(
        @Param('id', new ParameterConverterPipe('ContactMessage', 'id')) message: ContactMessage,
        @CurrentUser() user,
        @Body() data: ContactMessageDto
    )
    {
        try {
            await this.service.update(data, message, user);
            return {
                // @ts-ignore
                message: { ...message.serialize(), author: user.serialize() }
            };
        }
        catch (error) {
            throw new BadRequestException('You can not edit this message!');
        }
    }

    @Delete(':id')
    async remove(
        @Param('id', new ParameterConverterPipe('ContactMessage', 'id')) message: ContactMessage,
        @CurrentUser() user,
    )
    {
        try {
            await this.service.remove(message, user);
            return {
                // @ts-ignore
                message: message.serialize()
            };
        }
        catch (error) {
            throw new BadRequestException('You can not to remove this message!');
        }
    }
}
