import jwt from "jsonwebtoken";
import { AppError } from "../../../utils/AppError.js";
import { handleError } from "../../../utils/globalErrorHandler.js";
import bcrypt from 'bcrypt';
import userModel from './../../../db/models/user.model.js';
import { nanoid,customAlphabet } from "nanoid";
import {sendEmail} from "../../../src/service/sendEmail.js";
import { validationResult } from 'express-validator';


// =========== SignUp ===========

export const signUp = handleError(async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password ,role} = req.body;
  const emailExist = await userModel.findOne({ email: email.toLowerCase() });

  if (emailExist) return next(new AppError("User already exists", 409));

  const hash = await bcrypt.hash(password, +process.env.saltRounds);

  const newUser = await userModel.create({
    name,
    email,
    password: hash,
role : role || "user",
  });

  res.status(201).json({ msg: "User created successfully", user: newUser });
});




// // =========== signIn ===========

export const signIn = handleError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const emailExist = await userModel.findOne({ email: email.toLowerCase() });

  if (!emailExist) {
    return next(new AppError("Invalid credentials", 404));
  }


  bcrypt.compare(password, emailExist.password)
    .then(passwordMatch => {
      if (!passwordMatch) {
        return next(new AppError("Invalid credentials", 404));
      }

  const token = jwt.sign(
    { id: emailExist._id, email },
    process.env.signatureKey,
    { expiresIn: '1h' }
  );

  res.status(200).json({ msg: "Sign-in successful", token });
});
});

// =========== forgetPassword ===========
export const forgetPassword = handleError(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new AppError("user not exist", 404));
  }

  const code = customAlphabet('0123456789', 5);
  const newCode = code();

  await sendEmail(email,"reset password", `<p>Your reset code is: <strong>${newCode}</strong></p>`);
  await userModel.findByIdAndUpdate(user._id, { code: newCode });
  res.status(200).json({ msg: "done" });
});



// =========== resetPassword ===========
export const resetPassword = handleError(async (req, res, next) => {
  const { email, password, code } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  if (user.code !== code || !code) {
    return next(new AppError("Invalid code", 404));
  }
  
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  await userModel.updateOne({ email }, { password: hash, code: "" });

  res.status(200).json({ msg: "done" });
});

