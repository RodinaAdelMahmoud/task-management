import dotenv from 'dotenv';
import  path  from 'path';
dotenv.config({path: path.resolve("config/.env")});

import express from 'express';
import connectionDB from './db/connectionDB.js';
import { AppError } from './utils/AppError.js';
import { globalErrorHandling } from './utils/globalErrorHandler.js';
import * as routers from './src/modules/index.routes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/users', routers.userRouter);
app.use('/task', routers.taskRouter);
app.use('/category', routers.categoryRouter);


connectionDB();


app.use('*', (req, res, next) => {
  next(new AppError(`URL not found${req.originalUrl}`, 404));
});

app.use(globalErrorHandling);


app.listen(port, () => console.log(`Server is running on port ${port}`));
