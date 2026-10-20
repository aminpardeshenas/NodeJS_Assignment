import http from "node:http";

function Test(req, res) {
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parts = req.url.split("/");
  const op = parts[1];
  const num1 = parseInt(parts[2]);
  const num2 = parseInt(parts[3]);

  switch (op) {
    case "Sum":
      res.write("Sum is : " + (num1 + num2));
      break;
    case "Minus":
      res.write("Minus is : " + (num1 - num2));
      break;
    default:
      res.write("Invalid operation!");
      break;
  }

  res.end();
}

const server = http.createServer(Test);
const port = 5000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
