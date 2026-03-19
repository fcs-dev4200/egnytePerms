import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getFiles } from "./utils/perms.js";
import logger from "./logger.js";
import PinoHttp, { pinoHttp } from "pino-http";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const filePath = join(dirname, "views");
const assetsPath = join(dirname, "public");

const app = express();

app.use(express.json());
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));
app.set("views", filePath);
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: null,
    },
    name: "loginCookie",
  }),
);

app.use(cookieParser());

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/log-in", async (req, res) => {
  const { username } = req.body;
  const loginUser = process.env.LOGIN_UN;
  const loginPw = await bcrypt.hash(process.env.LOGIN_PW, 10);
  const match = await bcrypt.compare(req.body.password, loginPw);
  const userObj = { username };
  if (match && username === loginUser) {
    req.session.user = userObj;
    // const sesh = req.session;
    const cookie = sesh.cookie;
    res.redirect("/");
  } else {
    res.render("login-error");
  }
});

app.get("/login-error", (req, res) => res.render("login-error"));

function handle(req, res) {
  req.log.info("something else");
  res.end("hello world");
}

const port = 8000;
app.listen(process.env.PORT || port, (err) => {
  if (err) {
    throw err;
  }
  console.log("Egnyte tool running on port:", port);
});

app.get("/", (req, res) => {
  const sessionData = req.session || {};
  if (sessionData.user) {
    res.render("index");
  } else {
    res.redirect("/login");
  }
});

app.post("/fixit", async (req, res) => {
  let errors = [];
  try {
    const startPath = req.body.path;
    const { directory } = req.body;
    const path = `/Shared/${directory}/${startPath}`;
    const response = await getFiles(path);
    // loading animation is done by js in EJS file.
    console.log("test", response);
    res.render("complete", {
      folders: response,
    });
  } catch (err) {
    errors.push(err);
    console.log(errors);
    res.status(500).send(`Error: ${err.message}`);
  }
});

app.get("/test", (req, res) => res.render("test"));
