'use strict';

const githubModule = require('./github')
const filesModule = require('./files')

module.exports = async({
  log,
  confs
}) => {
  
  const github = await githubModule({log, confs})
  const files = filesModule({log, confs})
  
  const updateContent = async (__, reply) => {
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
      
      if (reply == null) {
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