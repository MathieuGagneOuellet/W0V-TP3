import winston from 'winston';
const { combine, timestamp, json, prettyPrint, errors } = winston.format;

//source -> https://www.youtube.com/watch?v=YjEqmINAQpI
const magicienLogger = [
  winston.loggers.add("MagicienLogger", {
    level: 'info',
    format: combine(
      errors({ stack: true }),
      json(),
      timestamp(),
      prettyPrint()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: './logs/magicien.log' }),
    ],
    defaultMeta: { service: 'magicien-service' },
  })
];

const erreurLogger = [
  winston.loggers.add("ErrorLogger", {
    level: 'error',

    format: combine(
      json(),
      timestamp(),
      prettyPrint()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: './logs/error.log' }),
    ]
  })
];

const Loggers = {
  magicienLogger,
  erreurLogger
};
export default Loggers;