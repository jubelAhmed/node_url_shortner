const hostname = "127.0.0.1";
const port = 8080;

const server = require("./controler/controler");


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
