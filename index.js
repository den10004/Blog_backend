import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import {
  loginValidation,
  registerValidation,
  postCreateValidation,
} from "./validation/auth.js";
import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe } from "./controllers/UserController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  getTags,
  getPostComments,
} from "./controllers/PostController.js";
import handleErrors from "./utils/handleErrors.js";

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.ngi535z.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB OK"))
  .catch(() => console.log("MongoDB error"));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());

app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/auth/me", checkAuth, getMe); //авторизован или нет
app.post("/auth/login", loginValidation, handleErrors, login);
app.post("/auth/register", registerValidation, handleErrors, register);

app.get("/posts", getAll);
app.get("/tags", getTags);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postCreateValidation, handleErrors, create);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleErrors, update);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server OK");
});
