import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {User as CurrentUser} from '../../core/decorators/user.decorator';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {User} from '../../core/models/user.model';
import {PracticeSessionService} from '../services/practice-session.service';
import {PracticeSession} from '../../core/models/practice-session.model';
import {CoreException} from '../../core/exceptions/core.exception';
import {LanguageSkill} from '../../core/models/language-skill.model';
import {DateTimePipe} from '../../core/pipes/date-time.pipe';

@Controller('client/practice-session')
@UseGuards(AuthGuard())
export class PracticeSessionController
{
    constructor(
        private service: PracticeSessionService,
    ) {}

    @Get('list')
    async getList(
        @CurrentUser() user,
        @Query('lastDate', DateTimePipe) lastDate: Date,
        @Query('status') statusCode: string
    )
    {
        const status = await this.service.getStatusByCode(statusCode);
        const sessions = await this
            .service
            .getListQuery(user, {
                lastDate: lastDate,
                status: status
            })
            .populate('status')
            .populate('caller')
            .populate('callee')
            .populate('skill')
            .limit(10);

        return {
            sessions: sessions.map((session) => {

                return {
                    ...session.serialize(),
                    caller: session.caller.serialize(),
                    callee: session.callee.serialize(),
                };

            })
        };
    }

    @Post('init/:addressee/:skill')
    async init(
        @Param('addressee', new ParameterConverterPipe('User', 'id')) addressee: User,
        @Param('skill', new ParameterConverterPipe('LanguageSkill', 'id')) skill: LanguageSkill,
        @Body('peer') peer: string,
        @CurrentUser() user,
    )
    {
        try {
            const session = await this.service.init(user, addressee, skill, peer);

            return {
                session: this.serializeSession(session)
            };
        }
        catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put('end/:id')
    async end(
        @Param('id', new ParameterConverterPipe('PracticeSession', 'id') ) session: PracticeSession,
        @CurrentUser() user,
    )
    {
        try {
            await this.service.end(session, user);
            return {
                session: this.serializeSession(session)
            };
        }
        catch (error) {
            if (error instanceof CoreException)
            {
                throw new BadRequestException(error.message);
            }

            throw error;
        }
    }

    @Put('accept/:id')
    async accept(
        @Param('id', new ParameterConverterPipe('PracticeSession', 'id') ) session: PracticeSession,
        @Body('peer') peer: string,
        @CurrentUser() user,
    )
    {
        try {
            await this.service.accept(session, user, peer);
            return {
                session: this.serializeSession(session)
            };
        }
        catch (error) {
            if (error instanceof CoreException)
            {
                throw new BadRequestException(error.message);
            }

            throw error;
        }
    }

    @Delete(':id')
    async remove(
        @Param('id', new ParameterConverterPipe('PracticeSession', 'id') ) session: PracticeSession,
        @CurrentUser() user,
    )
    {

    }

    private serializeSession(session: PracticeSession)
    {
        return {
            // @ts-ignore
            ...session.serialize(),
            // @ts-ignore
            callee: session.callee.serialize(),
            // @ts-ignore
            caller: session.caller.serialize(),
            // @ts-ignore
            skill: session.skill.serialize()
        };
    }
}