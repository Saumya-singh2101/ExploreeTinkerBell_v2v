const Razorpay = require("razorpay");


let instance = null;

function getInstance() {
  if (instance) return instance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to use payment features."
    );
  }

  instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return instance;
}

// Proxy that defers construction until a property (e.g. `.orders`) is first accessed.
// This keeps the exported value a drop-in replacement for the real Razorpay instance
// while allowing the server to boot without payment credentials.
module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getInstance();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);
