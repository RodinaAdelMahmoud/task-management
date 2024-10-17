import jwt from "jsonwebtoken";
import { AppError } from "../../../utils/AppError.js";
import { handleError } from "../../../utils/globalErrorHandler.js";
import taskModel from './../../../db/models/task.model.js';
import categoryModel from "../../../db/models/category.model.js";

// =========== ADD TASK ===========
export const addTask = handleError(async (req, res, next) => {

    const { title, description, status, priority,category } = req.body;

    const task = await taskModel.findOne({ title });

    if (task) {
      return next(new AppError("Task already exists", 409));
    }
const categoryExist = await categoryModel.findOne({title : category});

if(!categoryExist){
  return next(new AppError("Category not found", 404));
}


    const newTask = await taskModel.create({
        title,
        description,  
        status,
        priority, 
        category : categoryExist._id,
      });
    
      await categoryModel.findByIdAndUpdate(
        categoryExist._id,
        { $push: { tasks: newTask._id } },
        { new: true }
    );
      res.status(200).json({ newTask });
  
  });
  
  
  // // =========== GET TASKS ===========
  export const getTasks = handleError(async (req, res, next) => {
    const { status, priority, category ,page = 1, limit = 10, sort} = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (category) filters.category = category;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    if (sort) {
        const sortFields = ['dueDate', 'priority', 'status'];
        const sortField = sortFields.includes(sort) ? sort : 'dueDate'; 
        sortOption = { [sortField]: 1 }; 
    }

    const tasks = await taskModel.find(filters)
        .skip(skip)
        .limit(limitNum)
        .sort(sortOption); 




    if (!tasks.length) {
        return next(new AppError("No tasks found", 404));
    }

 const totalTasks = await taskModel.countDocuments(filters);
    const totalPages = Math.ceil(totalTasks / limitNum);

    res.status(200).json({ 
        totalTasks, 
        totalPages, 
        currentPage: pageNum, 
        tasks 
    });});

    // // =========== Update TASKS ===========

export const updateTask = handleError(async (req, res, next) => {

    const {  status, priority } = req.body;

    const newTask = await taskModel.findByIdAndUpdate(
        { _id: req.query.id },
        { status, priority },
        { new: true }
    );

    if (!newTask) {
        return next(new AppError("Task not found", 404));
    } 
   
      res.status(200).json({ newTask });
  
  });
  
// =========== delete TASKS =========== 
export const deleteTask = handleError(async (req, res, next) => {
  const { id } = req.query;

  const task = await taskModel.findOneAndUpdate(
      { _id: id, isDeleted: false }, 
      { isDeleted: true },          
      { new: true }
  );

  if (!task) {
      return next(new AppError("Task not found or already deleted", 404));
  }

  res.status(200).json({ msg: "Done" });
});

  
  
  
  