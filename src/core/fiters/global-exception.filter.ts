import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus, InternalServerErrorException} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(InternalServerErrorException)
export class GlobalExceptionFilter implements ExceptionFilter
{
    catch(exception: any, host: ArgumentsHost): any {

        const context = host.switchToHttp();

        const request: Request = context.getRequest<Request>();
        const response: Response = context.getResponse<Response>();

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'The service is not available. Please, try it later'
        });
    }
}