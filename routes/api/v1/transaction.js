const router = require("express").Router();
const axios = require("axios");

router.post("/", (req, res) => {
  const {
    coin_from,
    coin_to,
    deposit_amount,
    withdrawal,
    withdrawal_extra_id,
  } = req.body;

  axios.get(`https://api.n.exchange/en/api/v1/currency/`).then(({ data }) => {
    const from = data.find((e) => e.code === coin_from);
    const to = data.find((e) => e.code === coin_to);

    axios
      .post(`https://api.n.exchange/en/api/v1/orders/`, {
        amount_quote: deposit_amount,
        is_default_rule: false,
        pair: {
          name: `${coin_to}${coin_from}`,
        },
        withdraw_address: {
          address: withdrawal,
          [to.extra_id]: withdrawal_extra_id ?? null,
        },
      })
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
          deposit_amount: amount_quote,
          deposit_extra_id: deposit_address[from.extra_id] || null,
          execution_time: null,
          fee: 0,
          rate: amount_base / amount_quote,
          status: "wait",
          transaction_id: unique_reference,
          type: "nex",
          withdrawal: withdraw_address.address,
          withdrawal_amount: amount_base,
          withdrawal_extra_id: withdraw_address[to.extra_id] || null,
        };

        return res.json(resObject);
      })
      .catch((err) => {
        return res.json(err.response.data);
      });
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const statusList = {
    8: "refunded",
    11: "wait",
    12: "confirmation",
    13: "exchanging",
    14: "sending",
    15: "sending_confirmation",
    16: "success",
  };

  axios
    .get(`https://api.n.exchange/en/api/v1/orders/${id}/`)
    .then(({ data }) => {
      const {
        amount_quote,
        amount_base,
        pair,
        unique_reference,
        created_on,
        status_name,
        deposit_address,
        withdraw_address,
        transactions,
      } = data;

      const hashIn = transactions.find((e) => e.type === "D")?.tx_id || null;
      const hashOut = transactions.find((e) => e.type === "W")?.tx_id || null;

      const resObject = {
        created_at: created_on,
        status: statusList[status_name[0][0]],
        transaction_id: unique_reference,
        coin_from: pair.quote.code,
        coin_to: pair.base.code,
        deposit_amount: amount_quote,
        withdrawal_amount: amount_base,
        rate: amount_base / amount_quote,
        fee: 0,
        deposit: deposit_address.address,
        deposit_extra_id: deposit_address[pair.quote.extra_id] || null,
        withdrawal: withdraw_address.address,
        withdrawal_extra_id: withdraw_address[pair.base.extra_id] || null,
        final_amount: amount_base,
        hash_in: hashIn,
        hash_out: hashOut,
        rating: null,
        real_deposit_amount: amount_quote,
        real_withdrawal_amount: amount_base,
        type: "nex",
      };

      return res.json(resObject);
    });
});

module.exports = router;
