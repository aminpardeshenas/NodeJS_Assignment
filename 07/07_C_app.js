import fs from "node:fs";
import createApp from "./07_A_framework.js";

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

app.get("/GetUser", function(req, res, parts) {
  const targetId = parts[2];

  readDatabase((err, db) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error reading database!");
      return;
    }

    const user = db.users.find(
      (u) =>
        String(u.id) === String(targetId) ||
        String(u.random_id) === String(targetId)
    );

    if (!user) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("User not found!");
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(user));
  });
});

app.delete("/User", function(req, res, parts) {
  const authUsername = req.headers["username"];
  const authPassword = req.headers["password"];
  const targetId = parts[2];

  if (!authUsername || !authPassword) {
    res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Username and password are required in headers!");
    return;
  }

  if (!targetId) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("User id is required in the URL!");
    return;
  }

  readDatabase((err, db) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error reading database!");
      return;
    }

    const admin = db.users.find(
      (user) =>
        user.name === authUsername &&
        user.password === authPassword &&
        user.type === "admin"
    );

    if (!admin) {
      res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Unauthorized: valid admin credentials are required!");
      return;
    }

    const initialLength = db.users.length;

    db.users = db.users.filter(
      (user) =>
        String(user.id) !== String(targetId) &&
        String(user.random_id) !== String(targetId)
    );

    if (db.users.length === initialLength) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("User not found to remove!");
      return;
    }

    writeDatabase(db, (saveErr) => {
      if (saveErr) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Error writing database!");
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          message: "User removed successfully!",
          remaining_users: db.users
        })
      );
    });
  });
});

app.post("/User", function(req, res) {
  const { name, age, type, password } = req.body;

  if (!name || !password || !type) {
    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        message: "name, password and type are required"
      })
    );
    return;
  }

  readDatabase((err, db) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error reading database!");
      return;
    }

    const lastId =
      db.users.length > 0
        ? Math.max(...db.users.map((user) => Number(user.id) || 0))
        : 0;

    const newUser = {
      id: lastId + 1,
      name,
      age: age ? parseInt(age, 10) : null,
      random_id: Math.floor(10000000 + Math.random() * 90000000),
      type,
      password
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
        message: "User created successfully!",
        user: newUser
      }));
    });
  });
});


app.put("/User", function(req, res) {
  const { random_id, name, age } = req.body;

  if (!random_id) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("random_id is required!");
    return;
  }

  readDatabase((err, db) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error reading database!");
      return;
    }

    const user = db.users.find(
      (u) => String(u.random_id) === String(random_id)
    );

    if (!user) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("User not found!");
      return;
    }

    if (name) user.name = name;
    if (age) user.age = parseInt(age);

    writeDatabase(db, (saveErr) => {
      if (saveErr) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Error saving database!");
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          message: "User updated successfully!",
          updated_user: user
        })
      );
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
