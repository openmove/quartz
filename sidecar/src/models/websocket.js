'use strict';

const WebSocket = require('ws')

module.exports = ({
  log,
  confs
}) => {
  const {'server': {wsServer}} = confs
  
  const sendBuildMessage = async () => {
    try {
      log.info(`Connecting to quartz websocket at: ${wsServer}`)
      const ws = new WebSocket(wsServer)

      ws.on('open', () => {
        log.debug('WebSocket connection established')
        ws.send('rebuild')
      })

      ws.on('error', (error) => {
        log.error(`Something went wrong inside websocket: ${error}`)
      })

    } catch (error) {
      log.error(`Error establishing WebSocket connection: ${error}`)
    }
  }

  return {
    sendBuildMessage
  }
}