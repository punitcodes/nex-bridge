const router = require("express").Router();
const axios = require("axios");

router.post("/", (req, res) => {
  const { from, to, amount } = req.body;
  axios
    .get(
      `https://api.n.exchange/en/api/v1/get_price/${to}${from}/?amount_base=${amount}`
    )
    .then(({ data }) => {
      const {
        amount_quote,
        amount_base,
        min_amount_base,
        max_amount_base,
      } = data;
      const resObject = {
        amount: amount_quote,
        min_amount: min_amount_base,
        max_amount: max_amount_base,
        fee: 0,
        rate: amount_base / amount_quote,
      };

      return res.json(resObject);
    })
    .catch((err) => {
      const { min_amount_base, max_amount_base } = err.response.data;
      const resObject = {
        amount: 0,
        min_amount: min_amount_base,
        max_amount: max_amount_base,
        fee: 0,
        rate: 0,
      };

      return res.json(resObject);
    });
});

module.exports = router;
