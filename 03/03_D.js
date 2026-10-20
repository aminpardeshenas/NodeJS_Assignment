import http from "node:http";
import fs from "node:fs";

const controllers = [
  {
    name: "/Sum",
    run: (req, res, parts) => {
      const num1 = parseInt(parts[2]);
      const num2 = parseInt(parts[3]);
      res.write("Sum is : " + (num1 + num2));
    },
  },
  {
    name: "/Minus",
    run: (req, res, parts) => {
      const num1 = parseInt(parts[2]);
      const num2 = parseInt(parts[3]);
      res.write("Minus is : " + (num1 - num2));
    },
  },
  {
    name: "/CreateFile",
    run: (req, res, parts) => {
      const fileName = parts[2];
      const content = parts[3];

      fs.writeFileSync(fileName, content);
      res.write("File created successfully!");
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
  let handled = false;

  for (const controller of controllers) {
    if (req.url.startsWith(controller.name)) {
      controller.run(req, res, parts);
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
