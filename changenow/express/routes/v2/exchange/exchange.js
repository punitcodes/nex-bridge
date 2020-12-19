const router = require("express").Router();
const axios = require("axios");

router.post("/", (req, res) => {
  const referralKey = req.headers["api-key"] || null;

  const {
    fromCurrency,
    toCurrency,
    fromAmount = 0,
    toAmount = 0,
    address,
    extraId = null,
  } = req.query;

  axios.get(`https://api.n.exchange/en/api/v1/currency/`).then(({ data }) => {
    const fromCoin = data.find((e) => e.code === fromCurrency.toUpperCase());
    const toCoin = data.find((e) => e.code === toCurrency.toUpperCase());

    axios
      .post(
        `https://api.n.exchange/en/api/v1/orders/`,
        {
          amount_quote: fromAmount,
          amount_base: toAmount,
          is_default_rule: false,
          pair: {
            name: `${toCoin.code}${fromCoin.code}`,
          },
          withdraw_address: {
            address: address,
            [to.extra_id]: extraId,
          },
        },
        {
          headers: {
            "x-referral-token": referralKey,
          },
        }
      )
      .then(({ data }) => {
        const {
          amount_quote,
          amount_base,
          pair,
          deposit_address,
          withdraw_address,
          unique_reference,
        } = data;

        res.json({
          fromAmount: amount_quote,
          toAmount: amount_base,
          payinAddress: deposit_address.address,
          payoutAddress: withdraw_address.address,
          payinExtraId: deposit_address[from.extra_id] || null,
          payoutExtraId: withdraw_address[to.extra_id] || null,
          fromCurrency: pair.quote.code.toLowerCase(),
          toCurrency: pair.base.code.toLowerCase(),
          id: unique_reference,
        });
      });
  });
});

module.exports = router;
