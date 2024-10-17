import express from "express";
import * as UC from './user.controller.js'
import { loginValidator, signUpValidator } from './../../middleware/validation.js';

const router = express.Router();

router.post('/sign-up',signUpValidator, UC.signUp);
router.post('/sign-in', loginValidator, UC.signIn);
router.patch('/forget-password', UC.forgetPassword);
router.patch('/reset-password', UC.resetPassword);


export default router;
