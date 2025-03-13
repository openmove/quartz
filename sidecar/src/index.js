'use strict';

const fastify = require('fastify');
const routes = require('./routes');
const log = require('./logger');
const confs = require('./_confs');
const modelsFactory = require('./models');

(async () => {
  log.info('Starting sidecar')
  log.info('Initializing fastify server')
  
  log.debug('Initializing default status')
  const statusTable = {
    'timestamp': new Date().toISOString(),
    'status': 'alive'
  }
  
  const app = fastify()
      , {server} = confs
      , {port, host} = server;
  
  log.info('Initializing models')
  const {updateContent} = await modelsFactory({log, confs})

  log.info('Registering routes')
  for (const route of Object.values(routes)) {
    app.register(route, {log, confs, updateContent, statusTable, 'prefix': '/sidecar'})
  }

  const updateContentFunction = updateContent({
    'isHttp': false,
    'sendWsMessage': false
  })
  updateContentFunction()
  
  app.listen({
    port,
    host
  }, (err, address) => {
    if (err) {
      throw err;
    }
    log.info(`Server listening on ${address}`);
  })
})()