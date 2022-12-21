import { Router } from "express";
import { userlogin } from "../../controllers/userLogin";
import { userSignUp } from "../../controllers/userSignUp";

const router = Router();

router.post("/login", userlogin);

router.post("/signup", userSignUp);

export default router;
