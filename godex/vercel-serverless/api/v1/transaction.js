const axios = require("axios");

module.exports = (req, res) => {
  const {
    coin_from,
    coin_to,
    deposit_amount,
    withdrawal,
    withdrawal_extra_id,
    affiliate_id,
  } = req.body;

  axios.get(`https://api.n.exchange/en/api/v1/currency/`).then(({ data }) => {
    const from = data.find((e) => e.code === coin_from);
    const to = data.find((e) => e.code === coin_to);

    axios
      .post(
        `https://api.n.exchange/en/api/v1/orders/`,
        {
          amount_quote: deposit_amount,
          is_default_rule: false,
          pair: {
            name: `${coin_to}${coin_from}`,
          },
          withdraw_address: {
            address: withdrawal,
            [to.extra_id]: withdrawal_extra_id || null,
          },
        },
        {
          headers: {
            "x-referral-token": affiliate_id,
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

        const resObject = {
          coin_from: pair.quote.code,
          coin_to: pair.base.code,
          created_at: created_on,
          deposit: deposit_address.address,
          deposit_amount: parseFloat(amount_quote),
          deposit_extra_id: deposit_address[from.extra_id] || null,
          execution_time: null,
          fee: 0,
          rate: parseFloat(amount_base / amount_quote),
          status: "wait",
          transaction_id: unique_reference,
          type: "nex",
          withdrawal: withdraw_address.address,
          withdrawal_amount: parseFloat(amount_base),
          withdrawal_extra_id: withdraw_address[to.extra_id] || null,
        };

        return res.json(resObject);
      })
      .catch((_err) => {
        return res.status(400).json({
          error: {
            validation: {
              withdrawal: "invalid",
            },
          },
        });
      });
  });
};
