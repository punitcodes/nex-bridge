const axios = require("axios");

const getTransactions = ({ id }) => {
  const statusList = {
    8: "refunded",
    11: "waiting",
    12: "confirming",
    13: "exchanging",
    14: "sending",
    15: "finished",
    16: "finished",
  };

  return new Promise((res, _rej) => {
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

        const payinHash = (inTx && inTx.tx_id) || null;
        const payoutHash = (outTx && outTx.tx_id) || null;

        const result = [
          {
            id: unique_reference,
            createdAt: new Date(created_on).toISOString(),
            moneyReceived: parseFloat(amount_quote),
            moneySent: parseFloat(amount_base),
            payinConfirmations: (inTx && inTx.confirmations) || 0,
            status: statusList[status_name[0][0]],
            currencyFrom: pair.quote.code.toLowerCase(),
            currencyTo: pair.base.code.toLowerCase(),
            payinAddress: deposit_address.address,
            payinExtraId: deposit_address[pair.quote.extra_id] || null,
            payinHash,
            amountExpectedFrom: "1",
            payoutAddress: withdraw_address.address,
            payoutExtraId: withdraw_address[pair.base.extra_id] || null,
            payoutHash,
            refundHash: null,
            amountFrom: parseFloat(amount_quote),
            amountTo: parseFloat(amount_base),
          },
        ];

        res(result);
      });
  });
};

module.exports = getTransactions;
