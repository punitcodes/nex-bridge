const router = require("express").Router();
const axios = require("axios");

router.get("/", (req, res) => {
  axios.get(`https://api.n.exchange/en/api/v1/currency/`).then(({ data }) => {
    const currenciesArray = data.reduce((acc, cur) => {
      const {
        code,
        name,
        extra_id,
        is_crypto,
        is_quote_of_enabled_pair,
        is_base_of_enabled_pair,
      } = cur;

      const featured = ["BTC", "ETH"];
      const stable = ["USDT"];

      if ((is_crypto && is_quote_of_enabled_pair) || is_base_of_enabled_pair)
        acc.push({
          ticker: code.toLowerCase(),
          name,
          image: `https://beta.n.exchange/images/icons/coins/${code}.png`,
          hasExtraId: !!extra_id,
          featured: featured.includes(code),
          isStable: stable.includes(code),
          buy: is_base_of_enabled_pair,
          sell: is_quote_of_enabled_pair,
        });

      return acc;
    }, []);
    res.send(currenciesArray);
  });
});

module.exports = router;
