'use strict';

const updateContent = require('./update-content');
const healthz = require('./healthz');
const markAsDead = require('./mark-as-dead');

module.exports = {
  healthz,
  markAsDead,
  updateContent
}