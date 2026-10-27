import http from "node:http";

export default function createApp() {
  const controllers = [];

  return {
    get: function(name, func) {
      controllers.push({ name, func });
    },
    listen: function(port, callback) {
      const server = http.createServer((req, res) => {
        if (req.url === "/favicon.ico") {
          res.writeHead(204);
          res.end();
          return;
        }

        const parts = req.url.split("/");
        let handled = false;

        for (const controller of controllers) {
          if (req.url.startsWith(controller.name)) {
            controller.func(req, res, parts);
            handled = true;
            break;
          }
        }

        if (!handled) {
          res.writeHead(404);
          res.write("Invalid operation!");
          res.end();
        }
      });

      server.listen(port, callback);
    }
  };
}
