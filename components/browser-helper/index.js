var oldIE = (function () {
  var version = navigator.appVersion.split(';')
  if (version.length > 1) {
    return parseInt(version[1].replace(/[ ]/g, '').replace(/MSIE/g, ''), 9) < 9
  }
  return false
})()

if (oldIE) {
  document.documentElement.className += ' ie8'
  require('vendors/es5-shim.js')
  require('script!vendors/respond.js')
}
