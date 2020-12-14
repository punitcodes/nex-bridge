const axios = require("axios");

module.exports = (req, res) => {
  const { id } = req.query;

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

      const inTx = transactions.find((e) => e.type === "D");
      const outTx = transactions.find((e) => e.type === "W");

      const hashIn = (inTx && inTx.tx_id) || null;
      const hashOut = (outTx && outTx.tx_id) || null;

      const resObject = {
        created_at: created_on,
        status: statusList[status_name[0][0]],
        transaction_id: unique_reference,
        coin_from: pair.quote.code,
        coin_to: pair.base.code,
        deposit_amount: parseFloat(amount_quote),
        withdrawal_amount: parseFloat(amount_base),
        rate: parseFloat(amount_base / amount_quote),
        fee: 0,
        deposit: deposit_address.address,
        deposit_extra_id: deposit_address[pair.quote.extra_id] || null,
        withdrawal: withdraw_address.address,
        withdrawal_extra_id: withdraw_address[pair.base.extra_id] || null,
        final_amount: parseFloat(amount_base),
        hash_in: hashIn,
        hash_out: hashOut,
        rating: null,
        real_deposit_amount: parseFloat(amount_quote),
        real_withdrawal_amount: parseFloat(amount_base),
        type: "nex",
      };

      return res.json(resObject);
    });
};
