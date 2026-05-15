import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";

import session from "express-session";

import passport from "passport";

import { Strategy as GoogleStrategy }
  from "passport-google-oauth20";



import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// fake DB in memory (for now)
const users = [];

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
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

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages;

  const last = messages[messages.length - 1].content.toLowerCase();

  let reply = "";

  if (last.includes("visa")) {
    reply = "Which country are you applying to?";
  } else if (last.includes("us") || last.includes("usa")) {
    reply = "Got it — US visa. Are you applying for F1 (student visa)?";
  } else {
    reply = "Tell me your situation and I’ll help guide your visa process.";
  }

  res.json({ message: reply });
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
