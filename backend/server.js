import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";

import crypto from "crypto";

import chatRouter from "./routes/chat.js";

import session from "express-session";

import passport from "passport";

import { Strategy as GoogleStrategy }
  from "passport-google-oauth20";



import dotenv from "dotenv";

dotenv.config();

console.log("FRONTEND_ORIGIN:", JSON.stringify(process.env.FRONTEND_ORIGIN));
console.log("BACKEND_ORIGIN:", JSON.stringify(process.env.BACKEND_ORIGIN));
console.log("ADMIN_ORIGIN:", JSON.stringify(process.env.ADMIN_ORIGIN));

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.ADMIN_ORIGIN
];

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

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


app.use("/api/chat", chatRouter);


//function matches(text, values) {
//  text = text.toLowerCase();
//
//  return values.some(value =>
//    text.includes(value.toLowerCase())
//  );
//}
//
//function matchesUS(text) {
//  return matches(text, [
//    "us",
//    "usa",
//    "united states",
//    "america",
//    "美国",
//    "estados unidos",
//    "eeuu",
//    "ee.uu"
//  ]);
//}
//
//function matchesCanada(text) {
//  return matches(text, [
//    "canada",
//    "canadá",
//    "加拿大"
//  ]);
//}
//
//function matchesTourism(text) {
//  return matches(text, [
//    "tourism",
//    "tourist",
//    "vacation",
//    "holiday",
//    "tourismo",
//    "turismo",
//    "vacaciones",
//    "旅游",
//    "旅行"
//  ]);
//}
//
//function matchesStudy(text) {
//  return matches(text, [
//    "student",
//    "study",
//    "school",
//    "f1",
//    "estudiante",
//    "estudiar",
//    "学生",
//    "学习"
//  ]);
//}
//
//app.post("/api/chat", async (req, res) => {
//  if (!req.user) {
//    return res.status(401).json({
//      kind: "TEXT",
//      variant: "I18N",
//      key: "LOGIN_REQUIRED",
//    });
//  }
//
//  const { locale, messages } = req.body;
//
//  const last =
//    messages[messages.length - 1].content.trim();
//
//  let session = sessions.get(req.user.id);
//
//if (!session) {
//  session = {
//    state: "ASK_DESTINATION",
//    destination: null,
//    nationality: null,
//    purpose: null,
//  };
//
//  sessions.set(req.user.id, session);
//}
//
//  switch (session.state) {
//
//    case "START": {
//      session.state = "ASK_DESTINATION";
//
//      return res.json({
//        kind: "TEXT",
//        variant: "I18N",
//        key: "ASK_DESTINATION",
//      });
//    }
//
//    case "ASK_DESTINATION": {
//
//      if (matchesUS(last)) {
//        session.destination = "US";
//      } else if (matchesCanada(last)) {
//        session.destination = "CA";
//      } else {
//        return res.json({
//          kind: "TEXT",
//          variant: "I18N",
//          key: "ASK_DESTINATION",
//        });
//      }
//
//      session.state = "ASK_NATIONALITY";
//
//      return res.json({
//        kind: "TEXT",
//        variant: "I18N",
//        key: "ASK_NATIONALITY",
//      });
//    }
//
//    case "ASK_NATIONALITY": {
//
//      // For now just remember exactly what the user typed.
//      // Later you can normalize countries.
//      session.nationality = last;
//
//      session.state = "ASK_PURPOSE";
//
//      return res.json({
//        kind: "TEXT",
//        variant: "I18N",
//        key: "ASK_PURPOSE",
//      });
//    }
//
//    case "ASK_PURPOSE": {
//
//      if (matchesStudy(last)) {
//        session.purpose = "STUDY";
//      } else if (matchesTourism(last)) {
//        session.purpose = "TOURISM";
//      } else {
//        return res.json({
//          kind: "TEXT",
//          variant: "I18N",
//          key: "ASK_PURPOSE",
//        });
//      }
//
//      session.state = "DONE";
//
//      // TODO: Replace with actual visa rules.
//      return res.json({
//        kind: "TEXT",
//        variant: "I18N",
//        key: "VISA_GUIDE_PROMPT",
//      });
//    }
//
//    default: {
//      session.state = "START";
//
//      return res.json({
//        kind: "TEXT",
//        variant: "I18N",
//        key: "ASK_DESTINATION",
//      });
//    }
//  }
//});



import path from "path";

const views={} ;

app.get("/api/views", (req, res) => {
  res.json(views);
});

app.post("/api/view/:page", (req, res) => {
  const { page } = req.params;

  views[page] = (views[page] || 0) + 1;

  res.json({ page, views: views[page] });
});

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


app.post("/api/content/:page", (req, res) => {
  const { page } = req.params;
  const lang = req.query.lang || "en";

  const fileName = `${page}.${lang}.md`;
  const filePath = path.join(process.cwd(), "data", "content", fileName);

  const { content } = req.body;

  if (typeof content !== "string") {
    return res.status(400).send("Missing or invalid content");
  }

  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf-8");

    res.send({ ok: true, page, lang });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to write file");
  }
});



const IMAGE_DIR = path.join(process.cwd(), "data/images");
app.use("/images", express.static(IMAGE_DIR));

import multer from "multer";
fs.mkdirSync(IMAGE_DIR, { recursive: true });
const upload = multer({ dest: "data/tmp" });

app.get("/api/images", (req, res) => {
  fs.readdir(IMAGE_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read images" });
    }

    const images = files
      .filter(f => !f.startsWith("."))
      .map(f => `${process.env.BACKEND_ORIGIN}/images/${f}`);

    res.json(images);
  });
});



app.post("/api/images", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file" });
  }
  const ext = path.extname(req.file.originalname);
  const id = crypto.randomUUID();
  const finalName = `${id}${ext}`;
  const finalPath = path.join(IMAGE_DIR, finalName);
  fs.renameSync(req.file.path, finalPath);

  res.json({
    filename: finalName,
    url: `${process.env.BACKEND_ORIGIN}/images/${finalName}`
  });
});

const cmsStore =
    {
        data :
            {
                images :
                    fs.readdirSync("./data/images")
                        .filter((file)=>fs.statSync(path.join("./data/images",file)).isFile())
                        .map((file)=>`${process.env.BACKEND_ORIGIN}/images/${file}`) ,
                markdown :
                    {
                        en :
                            fs.readdirSync("./data/markdown/en")
                              .filter(file => fs.statSync(path.join("./data/markdown/en", file)).isFile())
                              .reduce((acc, file) => {
                                const name = file.replace(/\.md$/, "");
                                acc[name] = `${process.env.BACKEND_ORIGIN}/data/markdown/en/${file}`;
                                return acc;
                              }, {}) ,
                        es :
                            fs.readdirSync("./data/markdown/es")
                              .filter(file => fs.statSync(path.join("./data/markdown/es", file)).isFile())
                              .reduce((acc, file) => {
                                const name = file.replace(/\.md$/, "");
                                acc[name] = `${process.env.BACKEND_ORIGIN}/data/markdown/es/${file}`;
                                return acc;
                              }, {}) ,
                        zh :
                            fs.readdirSync("./data/markdown/zh")
                              .filter(file => fs.statSync(path.join("./data/markdown/zh", file)).isFile())
                              .reduce((acc, file) => {
                                const name = file.replace(/\.md$/, "");
                                acc[name] = `${process.env.BACKEND_ORIGIN}/data/markdown/zh/${file}`;
                                return acc;
                              }, {})
                    } ,
                metadata :
                    {
                        company :
                            {
                                name : "ELVA"
                            } ,
                        site :
                            {
                                title : "ELVA"
                            } ,
                    }
            }
    } ;

app.use(
  "/data",
  express.static(path.join(process.cwd(), "data"))
);

app.get("/api/data", (req, res) => {
    res.json(cmsStore.data);
});

app.post("/api/cms" , (req,res) => {
    cmsStore.data = req.body ;
    res.json({ok : true});
}) ;

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
