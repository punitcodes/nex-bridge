const axios = require("axios");

const getCurrencies = () => {
  return new Promise((res, _rej) => {
    axios
      .get(`https://api.n.exchange/en/api/v1/currency/`)
      .then(({ data }) => {
        const currenciesArray = data.reduce((coinsList, coin) => {
          const {
            code,
            is_crypto,
            is_quote_of_enabled_pair,
            is_base_of_enabled_pair,
          } = coin;
          if (
            (is_crypto && is_quote_of_enabled_pair) ||
            is_base_of_enabled_pair
          )
            coinsList.push(code.toLowerCase());

          return coinsList;
        }, []);

        res({ result: currenciesArray });
      })
      .catch(() => res({ result: [] }));
  });
};

module.exports = getCurrencies;
