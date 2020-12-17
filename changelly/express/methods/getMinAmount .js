const axios = require("axios");

const getMinAmount = ({ from, to }) => {
  return new Promise((res, _rej) => {
    axios
      .get(
        `https://api.n.exchange/en/api/v1/get_price/${to.toUpperCase()}${from.toUpperCase()}/`
      )
      .then(({ data: { min_amount_quote } }) =>
        res({ result: parseFloat(min_amount_quote).toString() })
      )
      .catch(() => res({ result: null }));
  });
};

module.exports = getMinAmount;
