var target = "http://192.168.2.113:8888";
//var target = "http://youthelite.zhaopin.com";
//var target = "http://54.222.196.139:8080";

var target1 = "http://192.168.5.221:3000";

var proxy = {
  '/search/user/search': {
    target: target,
    changeOrigin: true,
    secure: false,
    headers:{
      // Cookie: true
    }
  },
  '/search/category/detail': {
    target: target,
    changeOrigin: true,
    secure: false,
    headers:{
      // Cookie: true
    }
  },
  '/work/invite/**':{
    target: target1,
    changeOrigin: true,
    secure: false,
    headers:{
      // Cookie: true
    }
  },
  '/work/user/**':{
    target: target1,
    changeOrigin: true,
    secure: false,
    headers:{
      // Cookie: true
    }
  }
}

function bypass(req, res, proxyOptions) {
  console.log('========匹配到的url配置=======');
  console.log(proxyOptions);
  console.log('========当前请求的url=======');
  console.log(req.url);

  //当前请求的url
  var url = req.url;

  //打印
  var log = function(from, to, method) {
    var colors = require('colors')
    console.log('[proxy] ' + colors.cyan.underline(from) + ' -> ' + colors.yellow.underline(to) + ' -> ' + colors.red.underline(method))
  }

  //路由规则
  var ruleConfig = require('./rules.js')
  delete require.cache[require.resolve('./rules.js')]
  //从路由规则中查找匹配当前url的
  var matched = ruleConfig.rules.find(function(config) {
    if (config.url instanceof RegExp) {
      if (config.url.test(url)) {
        return true;
      }
    } else if (config.url === url.substring(0,url.indexOf('?'))) {
      return true;
    }

    return false;
  });
  console.log('========当前请求的url符合的规则=======');
  console.log(matched);

  //如果查找到符合的规则
  if (matched) {

    if(matched.local){
      var local =  'locals/data/' + req.url.replace(/\//g, '.').substring(1) + '.json';
      log(req.url, local, req.method);
      console.log('proxy rules 设置为直接返回本地文件');
      return local;
    }

    log(req.url, proxyOptions.target + req.url, req.method);
    console.log('proxy rules，设置为直接走代理请求');
    return false;

  }

}

Object.keys(proxy).forEach(function(key) {
  proxy[key].bypass = bypass;
});

exports.proxy = proxy;