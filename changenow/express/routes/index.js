const router = require("express").Router();

router.use("/v2/exchange", require("./v2/exchange/"));

module.exports = router;
