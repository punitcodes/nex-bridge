const axios = require("axios");

const createTransaction = (
  { from, to, address, extraId = null, amount },
  referralKey
) => {
  return new Promise((res, _rej) => {
    axios.get(`https://api.n.exchange/en/api/v1/currency/`).then(({ data }) => {
      const fromCoin = data.find((e) => e.code === from.toUpperCase());
      const toCoin = data.find((e) => e.code === to.toUpperCase());

      axios
        .post(
          `https://api.n.exchange/en/api/v1/orders/`,
          {
            amount_quote: amount,
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
            created_on,
          } = data;

          const result = {
            id: unique_reference,
            payinExtraId: deposit_address[from.extra_id] || null,
            payoutExtraId: withdraw_address[to.extra_id] || null,
            amountExpectedFrom: parseFloat(amount_quote),
            amountExpectedTo: parseFloat(amount_base),
            status: "new",
            currencyFrom: pair.quote.code,
            currencyTo: pair.base.code,
            amountTo: 0,
            payinAddress: deposit_address.address,
            payoutAddress: withdraw_address.address,
            createdAt: new Date(created_on).toISOString(),
          };

          res({ result: [result] });
        })
        .catch((err) => {
          const error = err.response.data.non_field_errors;

          if (/invalid characters/.test(error))
            res({ error: "invalid_address" });
          else res({ error: "out_of_range" });
        });
    });
  });
};

module.exports = createTransaction;
