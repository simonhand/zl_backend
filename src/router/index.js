const router = require('koa-router')();
const { getInfo } = require( '../controller/info')

router.get('/getInfo',getInfo);

module.exports = router;