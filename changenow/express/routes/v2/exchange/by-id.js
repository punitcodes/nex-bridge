const router = require("express").Router();
const axios = require("axios");

router.get("/", (req, res) => {
  const { id } = req.query;

  const statusList = {
    8: "refunded",
    11: "waiting",
    12: "confirming",
    13: "exchanging",
    14: "sending",
    15: "finished",
    16: "finished",
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

      const payinHash = inTx ? inTx.tx_id : null;
      const payoutHash = outTx ? outTx.tx_id : null;

      res.json({
        id: unique_reference,
        status: statusList[status_name[0][0]],
        fromCurrency: pair.quote.code.toLowerCase(),
        toCurrency: pair.base.code.toLowerCase(),
        expectedAmountFrom: parseFloat(amount_quote),
        expectedAmountTo: parseFloat(amount_base),
        amountFrom: parseFloat(amount_quote),
        amountTo: parseFloat(amount_base),
        payinAddress: deposit_address.address,
        payoutAddress: withdraw_address.address,
        payinExtraId: deposit_address[pair.quote.extra_id] || null,
        payoutExtraId: withdraw_address[pair.base.extra_id] || null,
        createdAt: new Date(created_on).toISOString(),
        depositReceivedAt: inTx ? new Date(inTx.time).toISOString() : null,
        payinHash,
        payoutHash,
      });
    });
});

module.exports = router;
