ko.bindingHandlers.onFinished = {
  update: function (element, valueAccessor, allBindingsAccessor) {
    ko.toJS(allBindingsAccessor())
    setTimeout(function () {
      var value = valueAccessor()
      if (typeof value !== 'function' || ko.isObservable(value)) throw new Error('run must be used with a function')
      value(element)
    })
  }
}

$.ajaxSetup({
  cache: false
})

var backend = function (path, data, detectingResultCode) {
  var dfd = $.Deferred()
  $.post(path, 'servicedata=' + encodeURIComponent(JSON.stringify(data))).done(function (data) {
    if (typeof data === 'string') {
      if (data.length > 0) data = JSON.parse(data)
      else data = {}
    }
    if (detectingResultCode === false) dfd.resolve(data)
    else if (parseInt(data.ResultCode) === 1) dfd.resolve(data)
    else dfd.reject(data)
  }).fail(function (xhr) {
    if (xhr.status === 403) location.href = '/login.html'
    var error = {
      ResultCode: xhr.status,
      Message: xhr.statusText
    }
    if (xhr.responseJSON && xhr.responseJSON.message) error.Message = xhr.responseJSON.message
    dfd.reject(error)
  })
  return dfd
}

var queryString = (function (a) {
  if (a === '') return {}
  var b = {}
  for (var i = 0; i < a.length; ++i) {
    var p = a[i].split('=')
    if (p.length !== 2) continue
    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '))
  }
  return b
})(window.location.search.substr(1).split('&'))

var getCountText = function (count) {
  count = count || 0
  if (count === 0) return null

  var result = count / 100000000
  var unit = '亿'
  if (result < 1) {
    result = count / 10000000
    unit = '千万'
  }
  if (result < 1) {
    result = count / 1000000
    unit = '百万'
  }
  if (result < 1) {
    result = count / 10000
    unit = '万'
  }
  if (result < 1) {
    result = count / 1000
    unit = '千'
  }
  if (result < 1) {
    result = count
    unit = ''
  }
  if (result % parseInt(result) === 0) result = result.toString()
  else result = result.toFixed(1)
  if (result.lastIndexOf('.0') === 1) result = parseInt(result).toString()
  return result + unit
}

var getTagName = function (name) {
  if (!name) return null
  if (name.indexOf('|') < 1) return name
  return name.split('|').slice(1).join('|')
}

module.exports = {
  backend: backend,
  queryString: queryString,
  getCountText: getCountText,
  getTagName: getTagName
}
