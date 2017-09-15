'use strict'

/* eslint */
/* global _, $, atob, FormData, Blob, Utils, client, server */

/**
 * OpenALPRAdapter Adapter
 * Returns licence plate data.
 */
function OpenALPRAdapter () {
  // Adapters
  var adapters = {
    'retrievePlate': function (imageDataURL) {
      return retrievePlate(imageDataURL)
    }
  }

  /**
   * Retreive a licence plate number.
   * @param {ImageDataURL} imageDataURL ImageDataURL.
   * @return {Promise} promise Promise object.
   * @public
   */
  var retrievePlate = function (imageDataURL) {
    return new Promise(function (resolve, reject) {
      // Error is in format of $.ajax response object for consistant response.
      var err = {'responseText': ''}
      if (!Utils().isConfigValid()) {
        err = {'responseText': 'Missing configuration files!'}
        reject(err)
        return null
      }
      var blob = dataURItoBlob(imageDataURL)
      if (_.isNil(blob)) {
        err = {'responseText': 'OpenALPRAdapter.dataURItoBlob: Invalid blob object'}
        reject(err)
        return null
      }
      var url = getCloudAPIUrl()
      if (_.isNil(url)) {
        err = {'responseText': 'Unable to get cloud API Url!'}
        reject(err)
        return null
      }

      var formData = new FormData()
      formData.append('image', blob)
      var options = {
        'method': 'POST',
        'url': url,
        'success': resolve,
        'error': reject,
        'contentType': false,
        'processData': false,
        'data': formData
      }
      return $.ajax(options)
    })
  }

  /**
   * Get the REST endpoint for OpenALPR requests.
   * @return {string} URL for OpenALPR REST endpoint.
   * @private
   */
  var getCloudAPIUrl = function () {
    var secretKey = _.get(server, 'secretKey', null)  // Requres a variable server to be defined.
    if (!secretKey) {
      console.error('Unable to get secret key!')
      return null
    }
    var cloudapiSecretKey = secretKey

    var country = _.get(client, 'country', null)  // Requres a variable server to be defined.
    if (!country) {
      console.error('Unable to get country code!')
      return null
    }
    var url = 'https://api.openalpr.com/v2/recognize?recognize_vehicle=1&country=' + country + '&secret_key=' + cloudapiSecretKey + '&return_image=false'
    return url
  }

  /**
   * Convert a dataURI to a Blob
   * @param {ImageDataURL} imageDataURL ImageDataURL.
   * @return {blob} Blob object.
   * @private
   */
  function dataURItoBlob (imageDataURL) {
    try {
      if (!imageDataURL) {
        console.error('OpenALPRAdapter.dataURItoBlob: Invalid imageDataURL')
        return null
      }

     // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString
      if (imageDataURL.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(imageDataURL.split(',')[1])
      } else {
        byteString = unescape(imageDataURL.split(',')[1])
      }

      // separate out the mime component
      var mimeString = imageDataURL.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      return new Blob([ia], {type: mimeString})
    } catch (e) {
      console.error('OpenALPRAdapter.dataURItoBlob: Unable to parse imageDataURL')
      return null
    }
  }

  // Return adapters (must be at end of adapter)
  return adapters
}

window.exports = OpenALPRAdapter
// End A (Adapter)
