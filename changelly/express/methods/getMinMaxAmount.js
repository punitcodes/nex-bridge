const axios = require("axios");

const getMinMaxAmount = ({ from, to }) => {
  return new Promise((res, _rej) => {
    axios
      .get(
        `https://api.n.exchange/en/api/v1/get_price/${to.toUpperCase()}${from.toUpperCase()}/`
      )
      .then(({ data: { min_amount_quote, max_amount_quote } }) =>
        res({
          result: { minAmount: min_amount_quote, maxAmount: max_amount_quote },
        })
      )
      .catch(() => res({ result: null }));
  });
};

module.exports = getMinMaxAmount;
