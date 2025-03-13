'use strict';

module.exports = async function updateContent(app, {
  'updateContent': updateContentFunction
}) {

  app.route({
    method: 'GET',
    url: '/update-content',
    handler: updateContentFunction({
      'isHttp': true,
      'sendWsMessage': true
    })
  })
}