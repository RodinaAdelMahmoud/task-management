import jwt from "jsonwebtoken";
import { AppError } from "../../../utils/AppError.js";
import { handleError } from "../../../utils/globalErrorHandler.js";
import bcrypt from 'bcrypt';
import userModel from './../../../db/models/user.model.js';
import { customAlphabet } from "nanoid";
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

  const newUser = await userModel.create({
    name,
    email,
    password,
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

// // =========== forgetPassword ===========
export const forgetPassword = handleError(async (req, res, next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return next(new AppError("User does not exist", 404));
    }

    const code = customAlphabet('0123456789', 5)();
    
    const redis = req.app.get('redis');
    await redis.setex(email, 15 * 60, code); 

    await sendEmail(email, "Reset password", `<p>Your reset code is: <strong>${code}</strong></p>`);
    res.status(200).json({ msg: "Reset code sent to your email." });
 
});

// =========== resetPassword ===========

export const resetPassword = handleError(async (req, res, next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, code } = req.body;

    const redis = req.app.get('redis');
    const storedCode = await redis.get(email);

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return next(new AppError("User does not exist", 404));
    }

    if (storedCode !== code) {
      return next(new AppError("Invalid reset code", 404));
    }

    const hash = await bcrypt.hash(password, 12);
    await userModel.updateOne({ email }, { password: hash });

    await redis.del(email);

    res.status(200).json({ msg: "Password reset successful." });
 
});