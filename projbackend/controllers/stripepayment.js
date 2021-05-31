const stripe = require("stripe")(
  "sk_test_51Iom65SCm55pyy6XMh4pXKRpQ3DCFCVNZ3Rv6HiGi6prgiDlhX0IZqJ213Z92jO2aAsF5GO3ejNLlgZ4mjWH8oXa00b8ICBBc3"
);
const uuid = require("uuid/v4");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;
  console.log("PRODUCTS", products);

  let amount = 0;
  products.map((p) => {
    amount = amount + p.price;
  });

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "A Test Account",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    })
    .catch(console.log("FAILED IN BACKEND--->"));
};
