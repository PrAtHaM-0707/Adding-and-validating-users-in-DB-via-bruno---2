const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { resolve } = require("path");

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.static("static"));

mongoose.connect("mongodb+srv://codex-in2:codex-in2@codex-in2.gjv2c.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.status(200).json({ success: "Login successful." });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
