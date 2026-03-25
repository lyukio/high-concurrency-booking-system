import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger {
  private logger = new Logger();

  log(message: string, context?: string, meta?: any) {
    this.logger.log(
      JSON.stringify({ message, context, ...meta })
    );
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(
      JSON.stringify({ message, context, ...meta })
    );
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(
      JSON.stringify({ message, context, ...meta })
    );
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(
      JSON.stringify({ message, context, trace, ...meta })
    );
  }
}