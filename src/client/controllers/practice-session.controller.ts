import {BadRequestException, Body, Controller, Param, Post, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {User as CurrentUser} from '../../core/decorators/user.decorator';
import {ParameterConverterPipe} from '../../core/pipes/parameter-converter.pipe';
import {User} from '../../core/models/user.model';
import {PracticeSessionService} from '../services/practice-session.service';
import {PracticeSession} from '../../core/models/practice-session.model';
import {CoreException} from '../../core/exceptions/core.exception';
import {LanguageSkill} from '../../core/models/language-skill.model';

@Controller('client/practice-session')
@UseGuards(AuthGuard())
export class PracticeSessionController
{
    constructor(
        private service: PracticeSessionService
    ) {}

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