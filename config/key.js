if (process.env.NODE_ENV === "prodiction") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
