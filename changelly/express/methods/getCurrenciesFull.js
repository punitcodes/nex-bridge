const axios = require("axios");

const getCurrenciesFull = () => {
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
      return `https://etherscan.io/tx/%1$s`;
    if (coin === "LTC")
      return `https://blockchair.com/litecoin/transaction/%1$s`;
    if (coin === "BTC")
      return `https://blockchair.com/bitcoin/transaction/%1$s`;
    if (coin === "DOGE") return `https://dogechain.info/tx/%1$s`;
    if (coin === "XVG") return `https://verge-blockchain.info/tx/%1$s`;
    if (coin === "BCH")
      return `https://blockchair.com/bitcoin-cash/transaction/%1$s`;
    if (coin === "NANO") return `https://nanocrawler.cc/explorer/block/%1$s`;
    if (coin === "ZEC") return `https://explorer.zcha.in/transactions/%1$s`;
    if (coin === "USDT") return `https://omniexplorer.info/tx/%1$s`;
    if (coin === "XLM") return `https://steexp.com/tx/%1$s`;
    if (coin === "XMR") return `https://xmrchain.net/tx/%1$s`;
    if (coin === "XRP")
      return `https://xrpcharts.ripple.com/#/transactions/%1$s`;
  };

  return new Promise((res, _rej) => {
    axios
      .get(`https://api.n.exchange/en/api/v1/currency/`)
      .then(({ data }) => {
        const currenciesArray = data.reduce((coinsList, coin) => {
          const {
            code,
            name,
            extra_id,
            min_confirmation,
            is_crypto,
            is_quote_of_enabled_pair,
            is_base_of_enabled_pair,
          } = coin;
          if (
            (is_crypto && is_quote_of_enabled_pair) ||
            is_base_of_enabled_pair
          )
            coinsList.push({
              name: code,
              ticker: code,
              fullName: name.charAt(0).toUpperCase() + name.slice(1),
              enabledFrom: is_quote_of_enabled_pair,
              enabledTo: is_base_of_enabled_pair,
              fixRateEnabled: true,
              payinConfirmations: min_confirmation,
              extraIdName: extra_id
                ? extra_id
                    .split("_")
                    .map(
                      (e) => e.charAt(0).toUpperCase() + e.slice(1, e.length)
                    )
                    .join(" ")
                : null,
              addressUrl: null,
              transactionUrl: getBlockchainUrl(code),
              image: `https://beta.n.exchange/images/icons/coins/${code}.png`,
              fixedTime: 900000,
              contractAddress: null,
            });

          return coinsList;
        }, []);

        res({ result: currenciesArray });
      })
      .catch((err) => {
        res({ result: [] });
      });
  });
};

module.exports = getCurrenciesFull;
