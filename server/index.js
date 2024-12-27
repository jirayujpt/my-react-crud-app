import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// การเชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin", 
  database: "crud",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

// API สำหรับดึงข้อมูล
app.get("/profiles", (req, res) => {
  db.query("SELECT * FROM profiles", (err, result) => {
    if (err) return res.status(500).send({ message: "Database error", error: err });
    res.json(result);
  });
});

// API สำหรับเพิ่มข้อมูล
app.post("/profiles", (req, res) => {
  const { firstname, lastname, nickname, birthdate, gender } = req.body;
  db.query(
    "INSERT INTO profiles (firstname, lastname, nickname, birthdate, gender) VALUES (?, ?, ?, ?, ?)",
    [firstname, lastname, nickname, birthdate, gender],
    (err, result) => {
      if (err) return res.status(500).send({ message: "Error adding profile", error: err });
      res.status(201).send({ message: "Profile added successfully", result });
    }
  );
});

// API สำหรับอัปเดตข้อมูล
app.put("/profiles/:id", (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, nickname, birthdate, gender } = req.body;
  
    if (!firstname || !lastname || !nickname || !birthdate || !gender) {
      return res.status(400).send({ message: "Missing required fields" });
    }
  
    db.query(
      "UPDATE profiles SET firstname = ?, lastname = ?, nickname = ?, birthdate = ?, gender = ? WHERE id = ?",
      [firstname, lastname, nickname, birthdate, gender, id],
      (err, result) => {
        if (err) return res.status(500).send({ message: "Error updating profile", error: err });
        
        if (result.affectedRows === 0) {
          return res.status(404).send({ message: "Profile not found" });
        }
  
        res.send({ message: "Profile updated successfully", result });
      }
    );
  });

// API สำหรับลบข้อมูล
app.delete("/profiles/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM profiles WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send({ message: "Error deleting profile", error: err });
    
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Profile not found" });
    }

    res.send({ message: "Profile deleted successfully", result });
  });
});

// ตั้งค่าให้เซิร์ฟเวอร์ฟังที่พอร์ต 5000
app.listen(5000, () => console.log("Server running on port 5000"));

// ตั้งค่า CORS สำหรับ React (ฝั่งไคลเอ็นต์)
app.use(cors({ origin: "http://localhost:5174" })); // React อยู่ที่พอร์ต 5174
