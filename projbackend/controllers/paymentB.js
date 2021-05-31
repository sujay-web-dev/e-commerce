const braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "r5mzd8gdvk8vm2bh",
  publicKey: "6cw5r26cvrzfsncp",
  privateKey: "ed726c3fa4d111d75f2f2865d3056957",
});

exports.getToken = (req, res) => {
  console.log("Into get Token");
  gateway.clientToken.generate({}, (err, response) => {
    // pass clientToken to your front-end
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;

  let amountFromTheClient = req.body.amount;

  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(result);
      }
    }
  );
};
