const router = require("express").Router();

router.use("/coins", require("./coins"));
router.use("/info", require("./info"));
router.use("/info-revert", require("./info-revert"));
router.use("/pairs", require("./pairs"));
router.use("/transaction", require("./transaction"));

module.exports = router;
