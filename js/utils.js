'use strict'

/* eslint */
/* global  */

/**
 * Utils Adapter
 */
function Utils () {
  // Adapters
  var adapters = {
    'isConfigValid': function () {
      return isConfigValid()
    }
  }

  /**
   * Is the config valid
   * @return {Boolean} Boolean Config is valid.
   * @public
   */
  var isConfigValid = function () {
    if (!('server' in window)) {
      console.error('Unable to find server object!')
      return false
    }

    if (!('client' in window)) {
      console.error('Unable to find client object!')
      return false
    }

    return true
  }

  // Return adapters (must be at end of adapter)
  return adapters
}

window.exports = Utils
// End A (Adapter)
