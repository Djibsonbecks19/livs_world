const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ================= FRONTEND (FIX /) ================= */
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* ================= USER ID ================= */
app.post("/userId", async (req, res) => {
  try {
    const username = req.body.username;

    const r = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "userId failed" });
  }
});

/* ================= USER INFO ================= */
app.get("/user/:id", async (req, res) => {
  try {
    const r = await fetch(`https://users.roblox.com/v1/users/${req.params.id}`);
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: "user failed" });
  }
});

/* ================= FRIEND COUNT ================= */
app.get("/friends/:id", async (req, res) => {
  try {
    const r = await fetch(
      `https://friends.roblox.com/v1/users/${req.params.id}/friends/count`
    );
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: "friends failed" });
  }
});

/* ================= FOLLOWERS ================= */
app.get("/followers/:id", async (req, res) => {
  try {
    const r = await fetch(
      `https://friends.roblox.com/v1/users/${req.params.id}/followers/count`
    );
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: "followers failed" });
  }
});

/* ================= FOLLOWING ================= */
app.get("/following/:id", async (req, res) => {
  try {
    const r = await fetch(
      `https://friends.roblox.com/v1/users/${req.params.id}/followings/count`
    );
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: "following failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});