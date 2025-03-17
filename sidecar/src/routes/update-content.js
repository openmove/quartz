'use strict';

module.exports = async function updateContent(app, {
  log,
  updateContent,
  sendBuildMessage,
}) {

  app.route({
    method: 'GET',
    url: '/update-content',
    handler: async (__, reply) => {
      try {
        await updateContent()
        await sendBuildMessage()

        reply.status(200).send({'message': 'Content updated'})
      } catch (error) {
        log.error(error)
        reply.status(500).send({'message': 'Error updating content'})
      }
    }
  })
}