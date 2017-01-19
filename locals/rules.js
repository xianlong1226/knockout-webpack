// exports.cookie = [
// 'userinfo=' + escape(JSON.stringify({
//   examiner_id: 503,
//   examiner_name: 'yes',
//   examiner_weight: 50,
//   project_id: 2,
//   project_name: 'chai\'s project',
//   room_id: 153,
//   user_name: 'yangqi',
//   user_role: 2,
//   user_id: 15,
//   addr_id: 130,
//   addr_name: '智联招聘'
// }))
// ].join(';')

// 针对特定path的处理规则，若不定义，则直接转发到target
// handle取值：
// false：直接转发到target服务器
// true：拦截并以默认命名规则返回本地json文件，命名规则为：/a/b/c -> /locals/a.b.c.json
// 字符串：将此字符串作为路径返回其所指向的文件
// 函数：返回以上三值之一
exports.rules = [{
  url: '/search/user/search',
  method: 'GET',
  local: false
}, {
  url: '/search/category/detail',
  method: 'GET',
  local: false
}, {
  url:/^\/work\/invite/,
  method: 'GET',
  local: false
}, {
  url:/^\/work\/user/,
  method: 'GET',
  local: false
}]