const router = require("express").Router();
const {
  getCurrencies,
  getCurrenciesFull,
  getExchangeAmount,
  getMinAmount,
  getMaxAmount,
  getMinMaxAmount,
  createTransaction,
  getTransactions,
} = require("../methods/index");

router.post("/", (req, res) => {
  const { method, params = {} } = req.body;
  const referralKey = req.headers["api-key"] || null;

  // TODO: use switch case

  if (method === "getCurrencies") {
    getCurrencies().then((methodRes) =>
      res.json({ id: new Date().toISOString(), ...methodRes })
    );
    return true;
  }
  if (method === "getCurrenciesFull") {
    getCurrenciesFull().then((methodRes) =>
      res.json({ id: new Date().toISOString(), ...methodRes })
    );
    return true;
  }
  if (method === "getExchangeAmount") {
    getExchangeAmount(params).then((methodRes) =>
      res.json({ id: new Date().toISOString(), ...methodRes })
    );
    return true;
  }
  if (method === "getMinAmount") {
    getMinAmount(params).then((methodRes) =>
      res.json({ id: new Date().toISOString(), ...methodRes })
    );
    return true;
  }
  if (method === "getMaxAmount") {
    getMaxAmount(params).then((methodRes) =>
      res.json({ id: new Date().toISOString(), ...methodRes })
    );
    return true;
  }
  if (method === "getMinMaxAmount") {
    getMinMaxAmount(params).then((methodRes) =>
      res.json({ id: new Date().toISOString(), ...methodRes })
    );
    return true;
  }
  if (method === "createTransaction") {
    createTransaction(params, referralKey).then((methodRes) =>
      res.json({ id: new Date().toISOString(), ...methodRes })
    );
    return true;
  }
  if (method === "getTransactions") {
    getTransactions(params).then((methodRes) =>
      res.json({ id: new Date().toISOString(), result: methodRes })
    );
    return true;
  }
});

module.exports = router;
