const router = require("express").Router();
const axios = require("axios");

router.get("/", (req, res) => {
  const { fromCurrency, toCurrency } = req.query;

  axios
    .get(
      `https://api.n.exchange/en/api/v1/get_price/${toCurrency.toUpperCase()}${fromCurrency.toUpperCase()}/`
    )
    .then(({ data: { pair, min_amount_quote } }) =>
      res.json({
        fromCurrency: pair.quote.toLowerCase(),
        toCurrency: pair.base.toLowerCase(),
        minAmount: min_amount_quote,
      })
    )
    .catch(() => res({}));
});

module.exports = router;
