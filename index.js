import express from "express";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getFiles } from "./utils/perms.js";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const filePath = join(dirname, "views");
const assetsPath = join(dirname, "public");

const app = express();

app.use(express.json());
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.set("views", filePath);
app.set("view engine", "ejs");

const port = 8000;
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log("Egnyte tool running on port:", port);
});

app.get("/", (req, res) => res.render("index"));
app.post("/fixit", async (req, res) => {
  let errors = [];
  try {
    const startPath = req.body.path;
    const { directory } = req.body;
    const path = `/Shared/${directory}/${startPath}`;
    console.log("path", path);
    const response = await getFiles(path);
    res.render("complete", {
      status: response.status,
    });
  } catch (err) {
    errors.push(err);
    console.log(errors);
  }
});
