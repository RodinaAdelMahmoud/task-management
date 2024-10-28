import express from "express";
import * as userController from './user.controller.js'
import {  emailValidator, loginValidator, passwordValidator, signUpValidator } from './../../middleware/validation.js';

const router = express.Router();

router.post('/sign-up',signUpValidator, userController.signUp);
router.post('/sign-in', loginValidator, userController.signIn);
router.patch('/forget-password' ,emailValidator, userController.forgetPassword);
router.patch('/reset-password',passwordValidator, userController.resetPassword);


export default router;
