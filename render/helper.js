/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-03 10:36:34
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-03 18:56:48
 */
exports.$ = (id) => {
  return document.getElementById(id)
}
exports.convertDuration = (time) => {
  // 计算分钟 个位数返回 '01' 多位数返回 '010'
  const minutes = '0' + Math.floor(time / 60)
  // 计算秒数 单数返回 '02' 多位数返回 '020'
  const seconds = '0' + Math.floor(time - minutes * 60)
  return minutes.substr(-2) + ':' + seconds.substr(-2)
}
