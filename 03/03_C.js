import http from "node:http";

const controllers = [
  {
    name: "/Sum",
    run: (req, res, num1, num2) => {
      res.write("Sum is : " + (num1 + num2));
    },
  },
  {
    name: "/Minus",
    run: (req, res, num1, num2) => {
      res.write("Minus is : " + (num1 - num2));
    },
  },
];

function Test(req, res) {
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parts = req.url.split("/");
  const op = "/" + parts[1];
  const num1 = parseInt(parts[2]);
  const num2 = parseInt(parts[3]);

  let handled = false;

  for (const controller of controllers) {
    if (req.url.startsWith(controller.name)) {
      controller.run(req, res, num1, num2);
      handled = true;
      break;
    }
  }

  if (!handled) {
    res.write("Invalid operation!");
  }

  res.end();
}

const server = http.createServer(Test);
const port = 5000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
