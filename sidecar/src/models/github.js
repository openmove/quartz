'use strict';

module.exports = async({
  log,
  confs
}) => {
  const {Octokit} = await import('@octokit/rest')
  const {
    'github': {
      token,
      owner,
      neuronRepo,
    }
  } = confs

  if (token == null) {
    throw new Error('Personal access token is required to use this project. Contact an administrator if you need one.');
  }

  log.info('Connecting to github api with provided access token');
  const octokit = new Octokit({
    'auth': token
  });
  
  const getNeuronRepoDownloadUrl = async () => {
    const gitResponse = await octokit.rest.repos.downloadZipballArchive({
      owner,
      'repo': neuronRepo
    });

    const {status, url} = gitResponse;

    if (status !== 200 || url == null) {
      log.error({status}, 'Failed to download neuron repo');
      throw new Error('Failed to download neuron repo');
    }

    return url
  } 

  return {
    getNeuronRepoDownloadUrl
  }
}