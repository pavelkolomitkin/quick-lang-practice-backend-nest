import {Body, Controller, Get, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {SearchPartnerService} from '../services/search-partner.service';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {Language} from '../../core/models/language.model';

@Controller('client/search-partner')
@UseGuards(AuthGuard())
export class SearchPartnerController
{
    constructor(
        private service: SearchPartnerService
    ) {}

    @Get('list')
    async getList(
        @Query('language', new ParameterConverterPipe('Language', 'id')) language: Language,
        @Query('page') page: number = 1
    )
    {

        const limit = 10;
        const offset = (page - 1) * limit;

        const users = await this.service.getUsers(language, limit, offset);
        return {
            users: users.map(user => user.serialize())
        };
    }
}