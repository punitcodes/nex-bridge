const router = require("express").Router();
const axios = require("axios");

router.get("/", (req, res) => {
  axios.get(`https://api.n.exchange/en/api/v1/currency/`).then(({ data }) => {
    const coinsList = [];

    const getBlockchainUrl = (coin) => {
      if (
        [
          "ETH",
          "EOS",
          "BDG",
          "GNT",
          "OMG",
          "QTM",
          "BAT",
          "REP",
          "BNB",
          "KCS",
          "KNC",
          "HT",
          "BNT",
          "BIX",
          "COB",
          "COSS",
        ].includes(coin)
      )
        return `https://etherscan.io/tx/`;
      if (coin === "LTC") return `https://blockchair.com/litecoin/transaction/`;
      if (coin === "BTC") return `https://blockchair.com/bitcoin/transaction/`;
      if (coin === "DOGE") return `https://dogechain.info/tx/`;
      if (coin === "XVG") return `https://verge-blockchain.info/tx/`;
      if (coin === "BCH")
        return `https://blockchair.com/bitcoin-cash/transaction/`;
      if (coin === "NANO") return `https://nanocrawler.cc/explorer/block/`;
      if (coin === "ZEC") return `https://explorer.zcha.in/transactions/`;
      if (coin === "USDT") return `https://omniexplorer.info/tx/`;
      if (coin === "XLM") return `https://steexp.com/tx/`;
      if (coin === "XMR") return `https://xmrchain.net/tx/`;
      if (coin === "XRP") return `https://xrpcharts.ripple.com/#/transactions/`;
    };

    data.forEach(
      ({
        code,
        name,
        extra_id,
        is_crypto,
        is_quote_of_enabled_pair,
        is_base_of_enabled_pair,
      }) => {
        if ((is_crypto && is_quote_of_enabled_pair) || is_base_of_enabled_pair)
          coinsList.push({
            code,
            icon: `https://beta.n.exchange/images/icons/coins/${code}.png`,
            has_extra: extra_id ? 1 : 0,
            extra_name: extra_id
              ? extra_id
                  .split("_")
                  .map((e) => e.charAt(0).toUpperCase() + e.slice(1, e.length))
                  .join(" ")
              : null,
            explorer: getBlockchainUrl(code),
            name: name.charAt(0).toUpperCase() + name.slice(1),
            disabled: 0,
          });
      }
    );

    return res.json(coinsList.sort((a, b) => (a.name > b.name ? 1 : -1)));
  });
});

module.exports = router;
