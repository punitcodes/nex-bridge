const router = require("express").Router();
const axios = require("axios");

router.post("/", (req, res) => {
  const { from, to, amount } = req.body;
  axios
    .get(
      `https://api.n.exchange/en/api/v1/get_price/${to}${from}/?amount_quote=${amount}`
    )
    .then(({ data }) => {
      const {
        amount_quote,
        amount_base,
        min_amount_quote,
        max_amount_quote,
      } = data;
      const resObject = {
        amount: amount_base,
        min_amount: min_amount_quote,
        max_amount: max_amount_quote,
        fee: 0,
        rate: amount_base / amount_quote,
      };

      return res.json(resObject);
    })
    .catch((err) => {
      const { min_amount_quote, max_amount_quote } = err.response.data;
      const resObject = {
        amount: 0,
        min_amount: min_amount_quote,
        max_amount: max_amount_quote,
        fee: 0,
        rate: 0,
      };

      return res.json(resObject);
    });
});

module.exports = router;
