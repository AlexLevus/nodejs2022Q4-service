import {Injectable, ConsoleLogger, Scope} from '@nestjs/common';

import { existsSync } from 'fs';

import { mkdir, appendFile, stat, readdir } from 'fs/promises';

const MAX_LOG_FILE_SIZE_KB = Number(process.env.MAX_LOG_FILE_SIZE_KB);

const logLevels = {
  error: {
    name: 'error',
    priority: 0,
  },
  warn: {
    name: 'warn',
    priority: 1,
  },
  log: {
    name: 'log',
    priority: 2,
  },
  debug: {
    name: 'debug',
    priority: 3,
  },
  verbose: {
    name: 'verbose',
    priority: 4,
  },
} as const;

type LogLevel = typeof logLevels[keyof typeof logLevels];

@Injectable({ scope: Scope.TRANSIENT })
class LoggerService extends ConsoleLogger {
  constructor() {
    super();

    process.on('uncaughtException', (err, origin) => {
      this.error(
        `Uncaught exception (listener): ${err}. Exception origin: ${origin}.`,
      );
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      this.error(`Unhandled Rejection (listener): ${reason}`);
    });
  }

  error(message: any, ...optionalParams: any[]): any {
    this.writeLogToFile(logLevels.error, message, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]): any {
    this.writeLogToFile(logLevels.log, message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.writeLogToFile(logLevels.warn, message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams): any {
    this.writeLogToFile(logLevels.verbose, message, ...optionalParams);
  }

  debug(message: any, ...optionalParams): any {
    this.writeLogToFile(logLevels.debug, message, ...optionalParams);
  }

  async writeLogToFile(
    log: LogLevel,
    message: string,
    ...optionalParams: any[]
  ) {
    const { name, priority } = log;

    if (priority > logLevels[process.env.LOG_LEVEL].priority) return;

    super[name](message, ...optionalParams);
    await this.writeToFile(name, message);
  }

  async writeToFile(level: LogLevel['name'], message: string) {
    const isError = level === logLevels.error.name;

    const folderName = new Date()
      .toLocaleDateString('ru-RU')
      .split('.')
      .join('-');
    const pathToFolder = `logs/${folderName}`;

    await mkdir(pathToFolder, { recursive: true });

    const files = await readdir(`${pathToFolder}`);
    const logFilesCount =
      files.filter((name) => name.includes('logs')).length || 1;
    const errorFilesCount =
      files.filter((name) => name.includes('errors')).length || 1;

    let fileName = isError
      ? `errors-${errorFilesCount}`
      : `logs-${logFilesCount}`;

    if (existsSync(`${pathToFolder}/${fileName}.txt`)) {
      const fileStat = await stat(`${pathToFolder}/${fileName}.txt`);
      const fileSizeInKb = fileStat.size / 1024;

      if (fileSizeInKb > MAX_LOG_FILE_SIZE_KB) {
        fileName = isError
          ? `errors-${errorFilesCount + 1}`
          : `logs-${logFilesCount + 1}`;
      }
    }

    await appendFile(
      `${pathToFolder}/${fileName}.txt`,
      `${new Date().toLocaleString('ru-RU')}: ${message}\n`,
    );
  }
}

export default LoggerService;
