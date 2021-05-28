import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { LoggerService } from './modules/logger';

@Catch()
export class AppAllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // TODO: Customize error response
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();

    // Logging Additional info
    LoggerService.error(
      'Un-handle exception',
      undefined,
      'AppAllExceptionsFilter',
    );
    LoggerService.error(
      `Request Path [${request.path}]`,
      undefined,
      'AppAllExceptionsFilter',
    );
    LoggerService.error(
      `Exception Details: \n ***** \n\t${exception} \n *****`,
      undefined,
      'AppAllExceptionsFilter',
    );

    // Calling super
    super.catch(exception, host);
  }
}
