/**
 * Helper to determine whether the path is relative
 * @param {string} path
 */

function isPathRelative(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../')
}

module.exports = {
  isPathRelative
}