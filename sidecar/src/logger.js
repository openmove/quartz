'use strict';

const pino = require('pino')
let logger = pino({
  'level': 'debug'
});

try {
  logger.info('Initializing pino-pretty')
  const stream = require('pino-pretty')({
    'colorize': true,
    'singleLine': true,
    'ignore': 'pid,hostname,time',
    'levelFirst': true
  });
  logger = pino({'level': 'debug'}, stream);
} catch (err) {
  logger.warn('Pino-pretty is not installed, using default logger');
}

module.exports = logger