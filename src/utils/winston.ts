import winston from 'winston';
import moment from 'moment';

const { createLogger, format, transports } = winston;
const { label, printf, combine } = format;

const LoggerFormat = printf((info: any) => {

    // FIXME: Fix file logging. Log files don't keep format
    return `${moment().format('YYYY-MM-DD HH-mm-ss SSS')} | [ ${info.label.toUpperCase()} ] | ${info.level.toUpperCase()} : ${info.message}`
});

const LoggerTransports = [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
];

const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0
    },
    colors: {
        trace: 'white',
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red'
    }
};

export const logger = createLogger({
    level: 'debug',
    levels: customLevels.levels,
    format: combine(
        label({ label: 'logger' }),
        LoggerFormat,
        // colorize({ all: true }),
    ),
    transports: LoggerTransports
});

export const sysLog = createLogger({
    level: "debug",
    levels: customLevels.levels,
    format: format.combine(
        label({ label: 'System' }),
        LoggerFormat,
        // colorize({ all: true }),
    ),
    transports: LoggerTransports
});

export const debug = createLogger({
    level: 'trace',
    levels: customLevels.levels,
    format: format.combine(
        label({ label: 'debug' }),
        LoggerFormat,
        // colorize({ all: true })
    ),
    transports: [
        new transports.Console({
            handleExceptions: true
        })
    ]
});

winston.addColors(customLevels.colors);

if (process.env.NODE_ENV !== 'production') {

    logger.add(new transports.Console({
        handleExceptions: true
    }));

    sysLog.add(new transports.Console({
        handleExceptions: true

    }));
}