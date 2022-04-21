
// 别问，问就是：代码越怪，运行越快；GrapQL不知道JSON.string前端的",模板字符串也没把“ " ”转义成 “ \" ”，只能这么怪搞
const zlDecodeList = (list) => {
  return JSON.parse(list.replace(/\+z\&l\+/g,"\""));
}
const zlEncodeList = (list) => {
  return JSON.stringify(list).replace(/\"/g,"+z&l+")
}
module.exports = { zlDecodeList,zlEncodeList}