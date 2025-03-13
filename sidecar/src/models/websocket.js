'use strict';

const WebSocket = require('ws')

module.exports = ({
  log,
  confs
}) => {
  const {'server': {service}} = confs
  
  const sendBuildMessage = async () => {
    try {
      const ws = new WebSocket(`ws://${service}:3001`)

      ws.on('error', (error) => {
        log.error(`Something went wrong inside websocket: ${error}`)
      })

      ws.send('rebuild')
      ws.close()
    } catch (error) {
      log.error(`Error establishing WebSocket connection: ${error}`)
    }
  }

  return {
    sendBuildMessage
  }
}