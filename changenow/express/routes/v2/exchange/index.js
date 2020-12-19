const router = require("express").Router();

router.use("/currencies", require("./currencies"));
router.use("/min-amount", require("./min-amount"));
router.use("/max-amount", require("./max-amount"));
router.use("/range", require("./range"));
router.use("/estimated-amount", require("./estimated-amount"));
router.use("/exchange", require("./exchange"));
router.use("/by-id", require("./by-id"));

module.exports = router;
