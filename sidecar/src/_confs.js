'use strict';

const {
  SERVER_PORT = '3555',
  SERVER_HOST = '0.0.0.0',

  GITHUB_TOKEN = '',
  GITHUB_OWNER = 'openmove',
  NEURON_GITHUB_REPO = 'neuron',
  QUARTZ_SERVICE = 'http://localhost:3001',

  DEFAULT_TEMP_DIR_SUBPATH = '/github-neuron',
  CONTENTS_FOLDER = './tmp/contents',
  TARGET_FOLDER = false,
  EXCLUDE_FILES = '',

} = process.env

const excludeFilesList = EXCLUDE_FILES.split(',')

module.exports = {
  'server': {
    'port': Number(SERVER_PORT),
    'host': SERVER_HOST,
    'wsServer': QUARTZ_SERVICE,
  },
  'github': {
    'token': GITHUB_TOKEN,
    'owner': GITHUB_OWNER,
    'neuronRepo': NEURON_GITHUB_REPO,
  },
  'fileSystem': {
    excludeFilesList,
    'defaultSubPath': DEFAULT_TEMP_DIR_SUBPATH,
    'contentsFolder': CONTENTS_FOLDER,
    'targetFolder': TARGET_FOLDER,
  }
}