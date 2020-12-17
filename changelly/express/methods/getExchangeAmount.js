const axios = require("axios");

// Sameple response from changelly

// {
//   jsonrpc: '2.0',
//   id: '2020-12-16T12:39:41.338Z',
//   result: '33.09526935'
// }
// {
//   jsonrpc: '2.0',
//   id: '2020-12-16T12:40:22.632Z',
//   error: {
//     code: -32600,
//     message: 'Invalid amount: minimal amount is 0.0015339'
//   }
// }
// {
//   jsonrpc: '2.0',
//   id: '2020-12-16T12:40:39.987Z',
//   error: {
//     code: -32602,
//     message: 'Not enough liquidity in pair btc->eth. Max amount is 35562.38094296856 btc.',
//     info: {
//       maximalAmountFrom: 35562.38094296856,
//       maximalAmountTo: 24942.068644999996
//     }
//   }
// }

const getExchangeAmount = ({ from, to, amount }) => {
  return new Promise((res, _rej) => {
    axios
      .get(
        `https://api.n.exchange/en/api/v1/get_price/${to.toUpperCase()}${from.toUpperCase()}/?amount_quote=${amount}`
      )
      .then(({ data: { amount_base } }) => {
        res({ result: parseFloat(amount_base).toString() });
      })
      .catch((err) => {
        const {
          min_amount_quote,
          max_amount_quote,
          max_amount_base,
        } = err.response.data;

        if (parseFloat(amount) < parseFloat(min_amount_quote))
          res({
            error: {
              code: -32600,
              message: `Invalid amount: minimal amount is ${parseFloat(
                min_amount_quote
              )}`,
            },
          });
        else if (parseFloat(amount) > parseFloat(max_amount_quote)) {
          res({
            error: {
              code: -32602,
              message: `Not enough liquidity in pair ${from.toLowerCase()}->${to.toLowerCase()}. Max amount is ${parseFloat(
                max_amount_quote
              )} ${from.toLowerCase()}.`,
              info: {
                maximalAmountFrom: parseFloat(max_amount_quote),
                maximalAmountTo: parseFloat(max_amount_base),
              },
            },
          });
        }
      });
  });
};

module.exports = getExchangeAmount;
