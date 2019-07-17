import {Controller, Get, Inject, NotFoundException, Param, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ParameterConverterPipe} from '../pipes/parameter-converter.pipe';
import {Response} from 'express';
import {ConfigService} from '../../config/config.service';
import {ImageThumbService} from '../services/image-thumb.service';

@Controller('user/avatar')
// @UseGuards(AuthGuard())
export class AvatarController
{
    constructor(private config: ConfigService, private thumbService: ImageThumbService) {

    }

    @Get(':id/:size')
    async getThumb(
        @Param('id', new ParameterConverterPipe('User', 'id')) user,
        @Param('size') size: string,
        @Res() response: Response
        )
    {
        try {
            const filePath = await this.thumbService.getUserAvatar(user, size);
            response.sendFile(filePath);
        }
        catch (error) {
            throw new NotFoundException();
        }

    }
}
