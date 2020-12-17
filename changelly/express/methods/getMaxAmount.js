const axios = require("axios");

const getMaxAmount = ({ from, to }) => {
  return new Promise((res, _rej) => {
    axios
      .get(
        `https://api.n.exchange/en/api/v1/get_price/${to.toUpperCase()}${from.toUpperCase()}/`
      )
      .then(({ data: { max_amount_quote } }) =>
        res({ result: parseFloat(max_amount_quote).toString() })
      )
      .catch(() => res({ result: null }));
  });
};

module.exports = getMaxAmount;
