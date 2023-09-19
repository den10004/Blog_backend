import { Router } from "express";
import { getPostComments } from "../controllers/PostController";
const router = new Router();

router.get("/comments/:id", getPostComments);
