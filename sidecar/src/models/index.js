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
  const {sendBuildMessage} = websocketModule({log, confs})

  const updateContent = async() => {
    const tempDir = await files.createTempDir()

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
      return;

    } catch (error) {
      log.error(error)
      return;

    } finally {
      await files.deleteTempDir(tempDir)
    }
  }

  return {
    files,
    github,
    updateContent,
    sendBuildMessage
  }
}