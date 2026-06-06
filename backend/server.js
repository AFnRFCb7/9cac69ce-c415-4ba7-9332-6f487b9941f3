import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";

import crypto from "crypto";

import session from "express-session";

import passport from "passport";

import { Strategy as GoogleStrategy }
  from "passport-google-oauth20";



import dotenv from "dotenv";

dotenv.config();

console.log("FRONTEND_ORIGIN:", JSON.stringify(process.env.FRONTEND_ORIGIN));
console.log("BACKEND_ORIGIN:", JSON.stringify(process.env.BACKEND_ORIGIN));

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.ADMIN_ORIGIN,
];

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

console.log("allowedOrigins  =", allowedOrigins);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// fake DB in memory (for now)
const users = [];

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user || null);
});


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        `${ process.env.BACKEND_ORIGIN }/auth/google/callback`,
    },

    (accessToken, refreshToken, profile, done) => {
        let user = users.find(user => user.id === profile.id);
        if(!user){
          user = {
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value ?? null,
            id: profile.id,
            locale: profile?._json?.locale ?? null ,
            photo: profile.photos?.[0]?.value ?? null ,
            magicNumber: 0
        }
      };

      done(null, user);
    }
  )
);

app.put("/me/magic-number", (req, res) => {
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.magicNumber = Number(req.body.magicNumber);

  // 🔥 REAL-TIME PUSH
  broadcast({
    type: "USER_UPDATED",
    user
  });

  res.json(user);
});


app.get("/avatar", async (req, res) => {
  const url = req.query.url;

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  res.setHeader("Content-Type", "image/jpeg");
  res.send(Buffer.from(buffer));
});

app.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  });
});

app.post("/set-language", (req, res) => {
  const { userId, language } = req.body;

  if (!users[userId]) {
    return res.status(404).send("User not found");
  }

  users[userId].language = language;

  res.json(users[userId]);
});

app.get("/me", (req, res) => {
  res.json(req.user || null);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    let user = users.find(user => user.id === req.user.id);
    if (!user) {
        user = req.user;
        user.magicNumber = 0 ;
        users.push(req.user);
    }
    req.user=user;
    res.redirect(process.env.FRONTEND_ORIGIN);
  }
);

const sessions = new Map();


import fs from "fs";

const FILE = "./data/immigration-news.json";

function ensureFileExists() {
  const dir = "./data";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify([], null, 2));
  }
}

// run once at startup
ensureFileExists();

function readNews() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch (e) {
    return [];
  }
}

function writeNews(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// GET all news
app.get("/api/immigration-news", (req, res) => {
  res.json(readNews());
});

// CREATE news article
app.post("/api/immigration-news", (req, res) => {
  const news = readNews();

  const newItem = {
    id: crypto.randomUUID(),
    ...req.body,
  };

  news.push(newItem);
  writeNews(news);

  res.status(201).json(newItem);
});

// UPDATE news article
app.put("/api/immigration-news/:id", (req, res) => {
  const news = readNews();
  const { id } = req.params;

  const index = news.findIndex(n => n.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "not found" });
  }

  news[index] = {
    ...news[index],
    ...req.body,
    id,
  };

  writeNews(news);

  res.json(news[index]);
});

// DELETE news article
app.delete("/api/immigration-news/:id", (req, res) => {
  const news = readNews();
  const { id } = req.params;

  const filtered = news.filter(n => n.id !== id);

  if (filtered.length === news.length) {
    return res.status(404).json({ error: "not found" });
  }

  writeNews(filtered);

  res.json({ ok: true });
});




app.post("/api/chat", async (req, res) => {
console.log("USER:", req.user);
if (!req.user) {
  return res.status(401).json({
    kind: "TEXT",
    variant: "I18N",
    key: "LOGIN_REQUIRED",
  });
}
  const messages = req.body.messages;

  const last =
    messages[messages.length - 1].content.toLowerCase();

  let session = sessions.get(req.user.id);

  if (!session) {
    session = {
      state: "START",
      country: null,
      visaType: null,
    };

    sessions.set(req.user.id, session);
  }

  switch (session.state) {

    case "START": {
      session.state = "ASK_COUNTRY";

      return res.json({
        kind: "TEXT",
        variant: "I18N",
        key: "ASK_COUNTRY",
      });
    }

    case "ASK_COUNTRY": {
      const text = last;

      if (text.includes("us") || text.includes("usa")) {
        session.country = "US";
        session.state = "ASK_VISA_TYPE";

        return res.json({
          kind: "TEXT",
          variant: "I18N",
          key: "US_VISA_F1_CLARIFY",
        });
      }

      return res.json({
        kind: "TEXT",
        variant: "I18N",
        key: "ASK_COUNTRY",
      });
    }

    case "ASK_VISA_TYPE": {
      const text = last;

      if (text.includes("student") || text.includes("f1")) {
        session.visaType = "F1";
        session.state = "DONE";

        return res.json({
          kind: "TEXT",
          variant: "I18N",
          key: "VISA_GUIDE_PROMPT",
        });
      }

      return res.json({
        kind: "TEXT",
        variant: "I18N",
        key: "US_VISA_F1_CLARIFY",
      });
    }

    default: {
      session.state = "START";

      return res.json({
        kind: "TEXT",
        variant: "I18N",
        key: "VISA_GUIDE_PROMPT",
      });
    }
  }
});

import path from "path";

app.get("/api/content/:page", (req, res) => {
  const { page } = req.params;
  const lang = req.query.lang || "en";

  const fileName = `${page}.${lang}.md`;
  const filePath = path.join(process.cwd(), "data" , "content", fileName);

  try {
    const markdown = fs.readFileSync(filePath, "utf-8");
    res.send(markdown); // IMPORTANT: not JSON
  } catch (err) {
    res.status(404).send("Not found");
  }
});


app.get("/health/:id", (req,res) => {
    res.json(req.params.id);
}) ;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("close", () => {
    clients.delete(ws);
  });
});

function broadcast(data) {
  const msg = JSON.stringify(data);

  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(msg);
    }
  }
}

server.listen(3000, "0.0.0.0", () => {
  console.log("API + WS listening on 0.0.0.0:3000");
});
