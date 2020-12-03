const router = require("express").Router();
const axios = require("axios");

router.get("/", (req, res) => {
  axios.get(`https://api.n.exchange/en/api/v1/currency/`).then(({ data }) => {
    const coinsList = [];

    data.forEach(
      ({
        code,
        name,
        extra_id,
        is_crypto,
        is_quote_of_enabled_pair,
        is_base_of_enabled_pair,
      }) => {
        if ((is_crypto && is_quote_of_enabled_pair) || is_base_of_enabled_pair)
          coinsList.push({
            code,
            icon: `https://beta.n.exchange/images/icons/coins/${code}.png`,
            has_extra: extra_id ? 1 : 0,
            extra_name: extra_id
              ? extra_id
                  .split("_")
                  .map((e) => e.charAt(0).toUpperCase() + e.slice(1, e.length))
                  .join(" ")
              : null,
            explorer: "https://google.com",
            name: name.charAt(0).toUpperCase() + name.slice(1),
            disabled: {
              from: is_quote_of_enabled_pair ? 1 : 0,
              to: is_base_of_enabled_pair ? 1 : 0,
            },
          });
      }
    );

    return res.json(coinsList);
  });
});

module.exports = router;
