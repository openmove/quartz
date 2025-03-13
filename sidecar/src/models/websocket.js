'use strict';

const WebSocket = require('ws')

module.exports = ({
  log,
  confs
}) => {
  const {'server': {service}} = confs
  const ws = new WebSocket(`ws://${service}:3001`)

  const sendBuildMessage = async () => {
    try {
      ws.send('rebuild')
    } catch (error) {
      log.error('Error establishing WebSocket connection:', error)
    }
  }

  return {
    sendBuildMessage
  }
}