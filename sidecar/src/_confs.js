'use strict';

const {
  SERVER_PORT = '3001',
  SERVER_HOST = '0.0.0.0',

  GITHUB_TOKEN = '',
  GITHUB_OWNER = 'openmove',
  NEURON_GITHUB_REPO = 'neuron',

  DEFAULT_TEMP_DIR_SUBPATH = '/github-neuron',
  CONTENTS_FOLDER = './tmp/contents'
} = process.env


module.exports = {
  'server': {
    'port': Number(SERVER_PORT),
    'host': SERVER_HOST,
  },
  'github': {
    'token': GITHUB_TOKEN,
    'owner': GITHUB_OWNER,
    'neuronRepo': NEURON_GITHUB_REPO,
  },
  'fileSystem': {
    'defaultSubPath': DEFAULT_TEMP_DIR_SUBPATH,
    'contentsFolder': CONTENTS_FOLDER,
  }
}