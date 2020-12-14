const router = require("express").Router();
const axios = require("axios");

router.get("/", (req, res) => {
  axios.get(`https://api.n.exchange/en/api/v1/pair/`).then(({ data }) => {
    const pairsList = {};

    const fiatCoins = ["AUD", "CAD", "EUR", "GBP", "JPY", "KRW", "RUB", "USD"];

    data.forEach(({ quote, base, disabled, test_mode }) => {
      if (!disabled && !test_mode && !fiatCoins.includes(quote)) {
        if (!Array.isArray(pairsList[quote])) pairsList[quote] = [];
        pairsList[quote].push(base);
      }
    });

    return res.json(pairsList);
  });
});

module.exports = router;
