'use strict';

const os = require('os')
    , fs = require('fs')
    , {promises} = fs
    , path = require('path')
    , axios = require('axios')
    , unzipper = require("unzipper")
    , {'v4': uuid} = require('uuid')


module.exports = ({
  log,
  confs
}) => {

  const {
    'fileSystem': {
      defaultSubPath,
      contentsFolder,
      targetFolder,
      excludeFilesList
    },
    'github': {
      owner,
      neuronRepo
    }
  } = confs;

  const createTempDir = async() => {
    const randomId = uuid();
    const tempDir = path.join(os.tmpdir(), defaultSubPath, randomId);

    log.info({tempDir}, 'Creating temporary directory');
    await promises.mkdir(tempDir, {recursive: true});
    
    log.info({tempDir}, 'Temporary directory created');
    return tempDir;
  }


  const deleteTempDir = async tempDir => {
    log.info({tempDir}, 'Deleting temporary directory');
    await promises.rm(tempDir, {recursive: true});
    
    log.info({tempDir}, 'Temporary directory deleted');
  }

  const getDownloadZipStream = async({url}) => {
    log.info({url}, 'Preparing to get download zip stream from axios');

    const response = await axios({
      url,
      responseType: 'stream',
    })

    const {data} = response;
    
    if (data == null) {
      log.error({response}, 'Failed to get download zip stream from axios');
      throw new Error('Failed to get download zip stream from axios');
    }

    return data
  }


  const extractZipFromStream = async({readStream, destinationFolder}) => {
    const extracter = unzipper.Extract({
      'path':  destinationFolder
    })

    readStream.pipe(extracter)
    return new Promise((resolve, reject) => {
      extracter.on('close', () => {
        log.info({destinationFolder}, 'Zip file extracted')
        resolve()
      })

      extracter.on('error', err => {
        log.error({err}, 'Error extracting zip from stream')
        reject(err)
      })
    }).catch(err => {
      log.error({err}, 'Error extracting zip from stream')
      throw err
    })
  }


  const findContentsRecursive = async inspectFolder => {
    log.debug({inspectFolder}, 'Looking for contents folder...')
    
    if (!targetFolder) {
      const inspectFolderSplitted = inspectFolder.split('/')
      const lastPath = inspectFolderSplitted[inspectFolderSplitted.length - 1]

      if (lastPath.includes(`${owner}-${neuronRepo}-`)) {  // exclude first iteration
        return inspectFolder
      }
    }
    
    const files = await promises.readdir(inspectFolder)
    
    for (const aFile of files) {
      const folderToCheck = path.join(inspectFolder, aFile)
      const fileStats = await promises.lstat(folderToCheck)

      if (fileStats.isDirectory()) {
        if (aFile === targetFolder) {
          log.info({folderToCheck}, 'Found contents folder')
          
          return folderToCheck
        }

        const foundFolder = await findContentsRecursive(folderToCheck)
        if (foundFolder != null) {
          return foundFolder
        }
      }
    }
  }


  const updateContents = async newContentsFolder => {
    log.info({newContentsFolder, contentsFolder}, 'Preparing to update contents...')
    const existsOldContentsFolder = fs.existsSync(contentsFolder)

    if (existsOldContentsFolder) {
      log.debug({contentsFolder}, 'Preparing to erase content folder')
      for (const aFile of await promises.readdir(contentsFolder)) {
        const toRemove = path.join(contentsFolder, aFile)
        
        log.debug({toRemove}, 'Removing old content')
        await promises.rm(toRemove, {recursive: true});
      }
    } else {
      log.debug({contentsFolder}, 'Content folder not found, creating it...')

      await promises.mkdir(contentsFolder, {recursive: true})
    }

    log.debug({newContentsFolder}, 'Removing files to exclude...')
    if (excludeFilesList.length > 0) {
      for (const aFile of await promises.readdir(newContentsFolder)) {
        if (excludeFilesList.includes(aFile)) {
          const toRemove = path.join(newContentsFolder, aFile)
        
          log.debug({toRemove}, 'Removing file to exclude')
          await promises.rm(toRemove, {recursive: true})
        }
      }
    }
    log.debug({newContentsFolder, contentsFolder}, 'Copying new contents...')
    await promises.cp(newContentsFolder, contentsFolder, {recursive: true})

    log.info({newContentsFolder, contentsFolder}, 'Contents updated')
  }

  return {
    createTempDir,
    deleteTempDir,
    updateContents,
    extractZipFromStream,
    getDownloadZipStream,
    findContentsRecursive
  }
}
