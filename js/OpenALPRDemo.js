'use strict'

/* eslint */
/* global _, $, FileReader, OpenALPRAdapter */

/**
 * init
 */
function OpenALPRAdapterDemo () {
  // Adapters
  var adapters = {
    'start': function () {
      return start()
    }
  }

  /**
   * startDemo - Adds on change event to input box.
   */
  var start = function () {
    $(document).on('change', 'input', function (input) {
      runOpenALPR(input)
    })
  }

  var runOpenALPR = function (input) {
    appendMessage('Please wait while OpenALPR is queried...')
    showImage(input)
  }

  var showImage = function (input) {
    if (!window.FileReader) {
      appendMessage('Browser does not support FileReader!')
      return
    }

    if (input.currentTarget.files && input.currentTarget.files[0]) {
      var reader = new FileReader()

      reader.onload = function (e) {
        var imageDataURL = e.target.result
        $('#uploadedImage').attr('src', imageDataURL)
        OpenALPRAdapter().retrievePlate(imageDataURL)
          .then(function (response) {
            cloudAPISuccess(response)
          })
          .catch(function (err) {
            cloudAPIError(err)
          })
      }
      reader.readAsDataURL(input.currentTarget.files[0])
    }
  }

  var cloudAPIError = function (err) {
    if (err && err.responseText) {
      appendMessage('Failed to retrieve data ' + err.responseText)
    } else {
      appendMessage('Exception occured', err)
    }
  }

  var cloudAPISuccess = function (response) {
    if (!response.results || response.results.length === 0) {
      appendMessage('No plate found in image.')
      return
    }
    for (var key in response.results) {
      var result = response.results[key]
      appendMessage('Plate: ' + result.plate)
      appendMessage('Region: ' + result.region)
      appendMessage('Make: ' + _.get(result, 'vehicle.make[0].name', ''))
      appendMessage('Model: ' + _.get(result, 'vehicle.make_model[0].name', ''))
      appendMessage('Body Type: ' + _.get(result, 'vehicle.body_type[0].name', ''))
      appendMessage('Color: ' + _.get(result, 'vehicle.color[0].name', ''))
    }

    var creditsRemaining = response.credits_monthly_total - response.credits_monthly_used
    appendMessage('Credits remaining: ' + creditsRemaining)
  }

  var appendMessage = function (message) {
    console.log(message)
    $('#messages').append('<div class="message">' + message + '</div>')
  }

  // Return adapters (must be at end of adapter)
  return adapters
}

window.exports = OpenALPRAdapterDemo
// End A (Adapter)

$(document).ready(function () {
  OpenALPRAdapterDemo().start()
})
