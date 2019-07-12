import {ClassSerializerInterceptor, Global, Module, ValidationPipe} from '@nestjs/common';
import {ConfigModule} from '../config/config.module';
import { models } from './providers/models.provider';
import { services } from './providers/services.provider';
import {APP_PIPE, APP_INTERCEPTOR, APP_FILTER} from '@nestjs/core';
import {LanguageController} from './controllers/language.controller';
import {LanguageLevelController} from './controllers/language-level.controller';
import {BadRequestFilter} from './fiters/bad-request.filter';

@Global()
@Module({
    providers: [
        ...services,
        ...models,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
        {
            provide: APP_FILTER,
            useClass: BadRequestFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
    ],
    imports: [
        ConfigModule,
    ],

    exports: [
        ConfigModule,
        ...services,
        ...models,
    ],

    controllers: [
        LanguageController,
        LanguageLevelController,
    ],

})
export class CoreModule {}
