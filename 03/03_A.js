import http from "node:http";

function Test(req, res) {
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parts = req.url.split("/");
  const num1 = parseInt(parts[1]);
  const num2 = parseInt(parts[2]);

  res.write("Sum is : " + (num1 + num2));
  res.end();
}

const server = http.createServer(Test);
const port = 5000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
