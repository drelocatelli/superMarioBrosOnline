const app = require("./app.cjs");
require("dotenv").config();

const { PORT } = require("../shared/constants/app.constants.cjs");

(() => {
  app.listen(PORT, () =>
    process.stdout.write(`Server running at port http://localhost:${PORT}`)
  );
})();