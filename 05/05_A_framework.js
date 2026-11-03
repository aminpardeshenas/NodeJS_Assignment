import http from "node:http";

export default function createApp() {
  const controllers = [];

  return {
    get: function(name, func) {
      controllers.push({ method: "GET", name, func });
    },
    post: function(name, func) {
      controllers.push({ method: "POST", name, func });
    },
    listen: function(port, callback) {
      const server = http.createServer((req, res) => {
        if (req.url === "/favicon.ico") {
          res.writeHead(204);
          res.end();
          return;
        }

        const parts = req.url.split("/");
        let matchedController = null;

        for (const controller of controllers) {
          if (controller.method === req.method && req.url.startsWith(controller.name)) {
            matchedController = controller;
            break;
          }
        }

        if (!matchedController) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write("Route not found or method not allowed!");
          res.end();
          return;
        }

        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", () => {
            matchedController.func(req, res, parts, body);
          });
        } else {
          matchedController.func(req, res, parts);
        }
      });

      server.listen(port, callback);
    }
  };
}
