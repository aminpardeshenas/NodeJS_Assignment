import fs from "node:fs";
import createApp from "./05_B_framework.js";

const app = createApp();
const DB_FILE = "db.json";

function readDatabase(callback) {
  fs.readFile(DB_FILE, "utf8", (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        fs.writeFile(DB_FILE, "[]", (writeErr) => {
          if (writeErr) {
            callback(writeErr, []);
            return;
          }
          callback(null, []);
        });
        return;
      }
      callback(err, []);
      return;
    }

    try {
      const data = JSON.parse(content);
      callback(null, data);
    } catch (parseErr) {
      callback(null, []);
    }
  });
}

function writeDatabase(data, callback) {
  fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), callback);
}

app.get("/Sum", function(req, res, parts) {
  const num1 = parseInt(parts[2]);
  const num2 = parseInt(parts[3]);
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Sum is : " + (num1 + num2));
});

app.get("/Minus", function(req, res, parts) {
  const num1 = parseInt(parts[2]);
  const num2 = parseInt(parts[3]);
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Minus is : " + (num1 - num2));
});

app.get("/CreateFile", function(req, res, parts) {
  const fileName = parts[2];
  const content = parts[3] || "";

  fs.writeFile(fileName, content, (err) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error creating file!");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("File created successfully!");
  });
});

app.post("/CreateUser", function(req, res) {
  readDatabase((err, users) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error reading database!");
      return;
    }

    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      name: req.body.name || "Unknown",
      age: req.body.age ? parseInt(req.body.age) : null
    };

    users.push(newUser);

    writeDatabase(users, (saveErr) => {
      if (saveErr) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Error writing database!");
        return;
      }

      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        message: "User created via POST Body successfully!",
        user: newUser
      }));
    });
  });
});

app.get("/Users", function(req, res) {
  readDatabase((err, users) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error reading database!");
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(users));
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000...");
});
