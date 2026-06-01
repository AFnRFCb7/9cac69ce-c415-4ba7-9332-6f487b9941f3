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
  cookie: {
    sameSite: "lax",   // IMPORTANT
    secure: false      // HTTP only (dev)
  }
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
});1


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
