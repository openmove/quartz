'use strict';

module.exports = async function healthz(app, {
  log,
  statusTable
}) {

  app.route({
    method: 'GET',
    url: '/healthz',
    handler: async (__, reply) => {
      log.info('🧠 Health probe called 🧠')
      
      const {status, timestamp} = statusTable

      if (status == 'alive') {
        log.info(`Sidecar is alive 💙. Last update at: ${timestamp}`)
        
        const now = new Date().toISOString()
        statusTable.timestamp = now

        return reply.status(200).send({
          timestamp,
          status,
        })
      }

      if (status == 'dead') {
        log.debug(`Sidecar was marked as killable at ${timestamp}`)
        log.error('Killing sidecar 💀')
        return reply.status(500).send({
          timestamp,
          status,
        })
      }

      log.warn('Unhandled case')
      return reply.status(500).send({
        timestamp,
        'status': 'unknown',
      })
    }
  })
}