import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from './logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  public async use(req: Request, res: Response, next: NextFunction) {
    await this.logger.log(
      `
       Request: 
          method: ${req.method}
          url: ${req.originalUrl}
          query: ${JSON.stringify(req.query)}
          body ${JSON.stringify(req.body)}
       Response: 
          statusCode: ${res.statusCode}`,
    );

    next();
  }
}
