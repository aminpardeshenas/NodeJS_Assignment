import fs from "node:fs";
import createApp from "./05_A_framework.js";

const app = createApp();

const users = [
  { id: 1, name: "Ali", age: 24 },
  { id: 2, name: "Sara", age: 28 }
];

app.get("/Sum", function(req, res, parts) {
  const num1 = parseInt(parts[2]);
  const num2 = parseInt(parts[3]);
  res.write("Sum is : " + (num1 + num2));
  res.end();
});

app.get("/Minus", function(req, res, parts) {
  const num1 = parseInt(parts[2]);
  const num2 = parseInt(parts[3]);
  res.write("Minus is : " + (num1 - num2));
  res.end();
});

app.get("/CreateFile", function(req, res, parts) {
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
});

app.get("/ReadFile", function(req, res, parts) {
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
});

app.get("/DeleteFile", function(req, res, parts) {
  const fileName = parts[2];

  fs.unlink(fileName, (err) => {
    if (err) {
      console.log("Error deleting file:", err);
      res.write("Failed to delete file!");
    } else {
      console.log("File deleted successfully!");
      res.write("File deleted successfully!");
    }
    res.end();
  });
});

app.get("/users", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(users));
  res.end();
});

app.get("/user", (req, res, parts) => {
  const userId = parseInt(parts[2]);
  const user = users.find(u => u.id === userId);

  if (user) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(user));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("User not found!");
  }
  res.end();
});

app.post("/users", (req, res, parts, body) => {
  try {
    const newUser = JSON.parse(body);
    newUser.id = users.length + 1;
    users.push(newUser);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "User added successfully!", data: newUser }));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("Invalid JSON data!");
  }
  res.end();
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
