'use strict';

const githubModule = require('./github')
const filesModule = require('./files')
const websocketModule = require('./websocket')
module.exports = async({
  log,
  confs
}) => {
  
  const github = await githubModule({log, confs})
  const files = filesModule({log, confs})
  const websocket = websocketModule({log, confs})


  const updateContent = useCase => async (__, reply) => {
    const tempDir = await files.createTempDir()
    const {
      isHttp,
      sendWsMessage
    } = useCase

    try {
      log.info('Updating content')

      const url = await github.getNeuronRepoDownloadUrl()
      const zipStream = await files.getDownloadZipStream({
        url,
        'destinationFolder': tempDir
      })
      await files.extractZipFromStream({
        'readStream': zipStream,
        'destinationFolder': tempDir
      })
      const contentsFolder = await files.findContentsRecursive(tempDir)

      if (contentsFolder == null) {
        throw new Error('Contents folder not found')
      }
      await files.updateContents(contentsFolder)

      log.info('💎 Content updated to quartz 💎')
      
      if (sendWsMessage) {
        try {
          await websocket.sendBuildMessage()
        } catch (error) {
          log.error('Impossible to send build message via websocket:', error)
        }
      }

      if (!isHttp) {
        return
      }

      reply.status(200).send({'message': 'Content updated' })
      return
    } catch (error) {
      log.error(error)
      
      if (reply == null) {
        return
      }

      reply.status(500).send({'message': 'Something went wrong' })
      return
    } finally {
      await files.deleteTempDir(tempDir)
    }
  }

  return {
    github,
    files,
    updateContent
  }
}