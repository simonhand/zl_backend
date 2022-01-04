const getInfo = async (ctx,next) => {
  ctx.body = {
    msg : "hellow ahut"
  }
}

module.exports = {
  getInfo,
}