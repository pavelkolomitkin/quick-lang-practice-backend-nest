import {
    BadRequestException,
    Body,
    Controller,
    Get, HttpCode,
    Param,
    Post,
    Put, Req, UseGuards, UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import {UserRegisterDto} from './dto/user-register.dto';
import {SecurityService} from './security.service';
import {UserConfirmRegisterDto} from './dto/user-confirm-register.dto';
import {UserRestorePasswordRequestDto} from './dto/user-restore-password-request.dto';
import {UserRestorePasswordDto} from './dto/user-restore-password.dto';
import {PasswordRestoreKeyValidator} from './validators/password-restore-key.validator';
import {AuthGuard} from '@nestjs/passport';
import {UserCredentialsDto} from './dto/user-credentials.dto';
import {plainToClass, Type} from 'class-transformer';
import {User} from '../core/models/user.model';
import {ClientUser} from '../core/models/client-user.model';

@Controller('security')
export class SecurityController {

    constructor(
        private readonly service: SecurityService,
        private readonly passwordRestoreKeyValidator: PasswordRestoreKeyValidator,
        ) {}

    @Post('register')
    async register(@Body() registerData: UserRegisterDto): Promise<void> {
        await this.service.register(registerData);
    }

    @Put('register-confirm')
    async confirmRegister(@Body() data: UserConfirmRegisterDto): Promise<void> {
        await this.service.confirmRegisteredAccount(data);
    }

    @Post('restore-password-request')
    async restorePasswordRequest(@Body() data: UserRestorePasswordRequestDto) {
        await this.service.requestRestorePassword(data);
    }

    @Get('validate-restore-password-key/:key')
    async validateRestorePasswordKey(@Param('key') key: string) {
        const isValid = await this.passwordRestoreKeyValidator.validate(key);
        if (!isValid)
        {
            throw new BadRequestException('The key is not valid!', 'key');
        }
    }

    @Put('restore-password')
    async restorePassword(@Body() data: UserRestorePasswordDto) {
        await this.service.restorePassword(data);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() data: UserCredentialsDto) {
        const loginData = await this.service.login(data);

        return {
            token: loginData.token,
        };
    }

    @Get('profile')
    @UseGuards(AuthGuard())
    async getProfile(@Req() { user }) {

        user = user.toObject();

        let userType = User;
        if (user.__t === 'ClientUser')
        {
            userType = ClientUser;
        }
        return plainToClass(userType, user);
    }
}
