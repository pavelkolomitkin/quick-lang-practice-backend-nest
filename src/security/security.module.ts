import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import {SecurityService} from './services/security.service';
import {UniqueUserEmailValidator} from './validators/unique-user-email.validator';
import {UserRegisterConfirmationKeyValidator} from './validators/user-register-confirmation-key.validator';
import {PasswordRestoreKeyValidator} from './validators/password-restore-key.validator';
import {UserEmailExistsValidator} from './validators/user-email-exists.validator';
import {JwtStrategy} from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {UserPasswordsEqualValidator} from './validators/user-passwords-equal.validator';
import {JwtAuthService} from './services/jwt-auth.service';
import {WsJwtGuard} from './guards/ws-jwt.guard';

@Module({
  imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
          secret: process.env.APP_SECRET,
      }),
  ],
  controllers: [SecurityController],
  providers: [
      PasswordRestoreKeyValidator,
      UniqueUserEmailValidator,
      UserEmailExistsValidator,
      UserRegisterConfirmationKeyValidator,
      UserPasswordsEqualValidator,

      JwtStrategy,
      SecurityService,
      JwtAuthService,
      WsJwtGuard
  ],
    exports: [
        PassportModule,
        JwtModule,
        WsJwtGuard,
    ],
})
export class SecurityModule {}
