import { body } from "express-validator";

export const passwordValidator = [

  body('password')  
    .notEmpty().withMessage('Password must not be empty.')
    .isLength({ min: 6 }).withMessage('The minimum password length is 6 characters.'),

]

export const emailValidator = [

  body('email')
    .notEmpty().withMessage('Email must not be empty.')
    .isEmail().withMessage('Invalid email format.'),
]


export const loginValidator = [
  emailValidator,
  passwordValidator
];


export const signUpValidator = [
  body('name')
    .notEmpty().withMessage('Name must not be empty.'),
  
  emailValidator,
  
  passwordValidator
];


export const taskValidator = [
  body('title')
    .notEmpty().withMessage('Title must not be empty.'),
  
  body('description')
    .notEmpty().withMessage('Description must not be empty.'),
  
  body('status')
    .notEmpty().withMessage('Status must not be empty.'),
  
  body('priority')
    .notEmpty().withMessage('Priority must not be empty.'),
  
  body('category')
    .notEmpty().withMessage('Category must not be empty.')
]

export const categoryValidator =[
  body('title')
    .notEmpty().withMessage('Title must not be empty.'),

  body('type')
    .notEmpty().withMessage('Type must not be empty.'),
]