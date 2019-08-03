import {ClassSerializerInterceptor, Global, Module, Provider, ValidationPipe} from '@nestjs/common';
import {ConfigModule} from '../config/config.module';
import { models } from './providers/models.provider';
import { services } from './providers/services.provider';
import {LanguageController} from './controllers/language.controller';
import {LanguageLevelController} from './controllers/language-level.controller';
import {SecurityModule} from '../security/security.module';
import {EntityExistsValidator} from './validators/entity-exists.validator';
import {MulterModule} from '@nestjs/platform-express';
import {AvatarController} from './controllers/avatar.controller';
import {ImageThumbService} from './services/image-thumb.service';
import {UploadManagerService} from './services/upload-manager.service';
import {APP_FILTER, APP_INTERCEPTOR, APP_PIPE} from '@nestjs/core';
import {BadRequestFilter} from './fiters/bad-request.filter';
import { providers as filters } from './providers/filters.provider';

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
        ...filters,
        EntityExistsValidator,
        ImageThumbService,
        UploadManagerService,
    ],
    imports: [
        ConfigModule,
        SecurityModule,
        MulterModule.register({
            dest: process.env.UPLOAD_DIRECTORY,
            limits: {
                fileSize: parseInt(process.env.MAX_UPLOAD_FILE_SIZE),
            }
        })
    ],
    exports: [
        ConfigModule,
        ...services,
        ...models,
        SecurityModule,
        MulterModule,
        EntityExistsValidator,
        ImageThumbService,
        UploadManagerService,
    ],
    controllers: [
        LanguageController,
        LanguageLevelController,
        AvatarController,
    ],

})
export class CoreModule {}
