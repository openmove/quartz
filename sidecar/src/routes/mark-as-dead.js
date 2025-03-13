'use strict';

module.exports = async (app, {
  log,
  statusTable
}) => {

  app.route({
    method: 'GET',
    url: '/mark-as-dead',
    handler: async (__, reply) => {
      log.info('💀 Sidecar marked as dead 💀')
      
      const now = new Date().toISOString()
      statusTable.timestamp = now
      statusTable.status = 'dead'

      return reply.status(200).send({
        'message': 'Request completed'
      })
    }
  })
}