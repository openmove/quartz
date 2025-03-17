'use strict';

module.exports = async function updateContent(app, {
  'updateContent': updateContentFunction
}) {

  app.route({
    method: 'GET',
    url: '/update-content',
    handler: async (__, reply) => {
      try {
        await updateContentFunction()
        await websocket.sendBuildMessage()

        reply.status(200).send({'message': 'Content updated'})
      } catch (error) {
        log.error(error)
        reply.status(500).send({'message': 'Error updating content'})
      }
    }
  })
}