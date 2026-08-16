const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`URL shortener API is running on port ${port}.`);
});
