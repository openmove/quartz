'use strict';

const WebSocket = require('ws')

module.exports = ({
  log,
  confs
}) => {
  const {'server': {service}} = confs
  
  const sendBuildMessage = async () => {
    const ws = new WebSocket(`ws://${service}:3001`)
    try {
      ws.send('rebuild')

      ws.close()
    } catch (error) {
      log.error('Error establishing WebSocket connection:', error)

      ws.close()
    }
  }

  return {
    sendBuildMessage
  }
}