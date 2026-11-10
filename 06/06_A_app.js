import fs from "node:fs";
import createApp from "./06_A_framework.js";

const app = createApp();
const DB_FILE = "db.json";

function readDatabase(callback) {
  fs.readFile(DB_FILE, "utf8", (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        const initialData = { users: [] };
        fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), (writeErr) => {
          if (writeErr) {
            callback(writeErr, initialData);
            return;
          }
          callback(null, initialData);
        });
        return;
      }
      callback(err, { users: [] });
      return;
    }

    try {
      const data = JSON.parse(content);
      if (!data.users || !Array.isArray(data.users)) {
        data.users = [];
      }
      callback(null, data);
    } catch (parseErr) {
      callback(null, { users: [] });
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
  readDatabase((err, db) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error reading database!");
      return;
    }

    const newUser = {
      id: db.users.length > 0 ? db.users[db.users.length - 1].id + 1 : 1,
      name: req.body.name || "Unknown",
      age: req.body.age ? parseInt(req.body.age) : null
    };

    db.users.push(newUser);

    writeDatabase(db, (saveErr) => {
      if (saveErr) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Error writing database!");
        return;
      }

      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        message: "User created and stored in object successfully!",
        user: newUser
      }));
    });
  });
});

app.get("/Users", function(req, res) {
  readDatabase((err, db) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error reading database!");
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(db));
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000...");
});
