const express = require("express");
const cors = require("cors");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

/* ================= USER ID ================= */
app.post("/userId", async (req, res) => {
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
});

/* ================= USER INFO ================= */
app.get("/user/:id", async (req, res) => {
  const r = await fetch(`https://users.roblox.com/v1/users/${req.params.id}`);
  res.json(await r.json());
});

/* ================= FRIEND COUNT ================= */
app.get("/friends/:id", async (req, res) => {
  const r = await fetch(
    `https://friends.roblox.com/v1/users/${req.params.id}/friends/count`
  );
  res.json(await r.json());
});

/* ================= START ================= */
app.listen(3000, () =>
  console.log("Roblox proxy running on http://localhost:3000")
);