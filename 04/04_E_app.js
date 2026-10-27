import fs from "node:fs";
import createApp from "./04_D_framework.js";


const app = createApp();

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


app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
