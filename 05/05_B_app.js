import fs from "node:fs";
import createApp from "./05_B_framework.js";

const app = createApp();

const users = [
  { id: 1, name: "Ali", age: 24 },
  { id: 2, name: "Sara", age: 28 }
];

app.get("/Sum", function(req, res, parts) {
  const num1 = parseInt(parts[2]);
  const num2 = parseInt(parts[3]);

  res.end("Sum is : " + (num1 + num2));
});

app.get("/Minus", function(req, res, parts) {
  const num1 = parseInt(parts[2]);
  const num2 = parseInt(parts[3]);

  res.end("Minus is : " + (num1 - num2));
});

app.get("/CreateFile", function(req, res, parts) {
  const fileName = parts[2];
  const content = parts[3];

  fs.writeFile(fileName, content, (err) => {
    if (err) {
      console.log("Error writing file:", err);
      res.end("Failed to create file!");
    } else {
      console.log("File saved successfully!");
      res.end("File created successfully!");
    }
  });
});

app.get("/ReadFile", function(req, res, parts) {
  const fileName = parts[2];

  fs.readFile(fileName, "utf8", (err, content) => {
    if (err) {
      console.log("Error reading file:", err);
      res.end("Failed to read file!");
    } else {
      res.end("File content: " + content);
    }
  });
});

app.get("/DeleteFile", function(req, res, parts) {
  const fileName = parts[2];

  fs.unlink(fileName, (err) => {
    if (err) {
      console.log("Error deleting file:", err);
      res.end("Failed to delete file!");
    } else {
      console.log("File deleted successfully!");
      res.end("File deleted successfully!");
    }
  });
});

app.get("/ShowData", function(req, res, parts, data) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
});

app.get("/users", function(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
});

app.get("/user", function(req, res, parts) {
  const userId = parseInt(parts[2]);
  const user = users.find((item) => item.id === userId);

  if (!user) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("User not found!");
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
});

app.post("/users", function(req, res, parts, body) {
  let newUser;

  try {
    newUser = JSON.parse(body);
  } catch (err) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Invalid JSON data!");
    return;
  }

  if (!newUser || typeof newUser !== "object" || Array.isArray(newUser)) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("User data must be a JSON object!");
    return;
  }

  newUser.id = users.length + 1;
  users.push(newUser);

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    message: "User added successfully!",
    data: newUser
  }));
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
