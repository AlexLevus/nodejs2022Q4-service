import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import LoggerService from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  public async use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.log(
        `
       Request: 
          method: ${req.method}
          url: ${req.originalUrl}
          query: ${JSON.stringify(req.query)}
          body ${JSON.stringify(req.body)}
       Response: 
          statusCode: ${res.statusCode}`,
      );
    });

    next();
  }
}
