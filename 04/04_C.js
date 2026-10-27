import http from "node:http";
import fs from "node:fs";

const controllers = [
  {
    name: "/Sum",
    run: (req, res, parts) => {
      const num1 = parseInt(parts[2]);
      const num2 = parseInt(parts[3]);
      res.write("Sum is : " + (num1 + num2));
      res.end();
    },
  },
  {
    name: "/Minus",
    run: (req, res, parts) => {
      const num1 = parseInt(parts[2]);
      const num2 = parseInt(parts[3]);
      res.write("Minus is : " + (num1 - num2));
      res.end();
    },
  },
  {
    name: "/CreateFile",
    run: (req, res, parts) => {
      const fileName = parts[2];
      const content = parts[3];

      fs.writeFile(fileName, content, (err) => {
        if (err) {
          console.log("Error writing file:", err);
          res.write("Failed to create file!");
        } else {
          console.log("File saved successfully!");
          res.write("File created successfully!");
        }
        res.end();
      });
    },
  },
  {
    name: "/ReadFile",
    run: (req, res, parts) => {
      const fileName = parts[2];

      fs.readFile(fileName, "utf8", (err, data) => {
        if (err) {
          console.log("Error reading file:", err);
          res.write("Failed to read file!");
        } else {
          res.write("File content: " + data);
        }
        res.end();
      });
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
    res.end();
  }
}

const server = http.createServer(Test);
const port = 5000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
