import {ClassSerializerInterceptor, Provider, ValidationPipe} from '@nestjs/common';
import {APP_FILTER, APP_INTERCEPTOR, APP_PIPE} from '@nestjs/core';
import {BadRequestFilter} from '../fiters/bad-request.filter';
import {GlobalExceptionFilter} from '../fiters/global-exception.filter';

const providers: Provider[] = [
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
];

if (process.env.NODE_ENV === 'production')
{
    providers.push({
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter,
    });
}

export { providers };