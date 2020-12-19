const router = require("express").Router();
const axios = require("axios");

router.get("/", (req, res) => {
  const { fromCurrency, toCurrency, fromAmount = 0, toAmount = 0 } = req.query;

  axios
    .get(
      `https://api.n.exchange/en/api/v1/get_price/${toCurrency.toUpperCase()}${fromCurrency.toUpperCase()}/?amount_quote=${fromAmount}&amount_base=${toAmount}`
    )
    .then(({ data: { pair, amount_quote, amount_base } }) =>
      res.json({
        fromCurrency: pair.quote.toLowerCase(),
        toCurrency: pair.base.toLowerCase(),
        transactionSpeedForecast: null,
        warningMessage: null,
        fromAmount: parseFloat(amount_quote),
        toAmount: parseFloat(amount_base),
      })
    )
    .catch(() => res({}));
});

module.exports = router;
