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

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;
        const parts = pathname.split("/");

        const data = {};
        parsedUrl.searchParams.forEach((value, key) => {
          data[key] = value;
        });

        let matchedController = null;

        for (const controller of controllers) {
          if (controller.method === req.method) {
            if (controller.name.toLowerCase() === pathname.toLowerCase()) {
              matchedController = controller;
              break;
            }
            if (parts[1] && controller.name.toLowerCase() === ("/" + parts[1]).toLowerCase()) {
              matchedController = controller;
              break;
            }
          }
        }

        if (matchedController) {
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                req.body = body ? JSON.parse(body) : {};
              } catch (e) {
                req.body = {};
              }
              matchedController.func(req, res, parts, data);
            });
          } else {
            matchedController.func(req, res, parts, data);
          }
        } else {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("404 Not Found");
        }
      });

      server.listen(port, callback);
    }
  };
}
