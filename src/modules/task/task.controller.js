import jwt from "jsonwebtoken";
import { AppError } from "../../../utils/AppError.js";
import { handleError } from "../../../utils/globalErrorHandler.js";
import taskModel from './../../../db/models/task.model.js';
import categoryModel from "../../../db/models/category.model.js";
import { logTaskChange } from "../../middleware/auditLog.js";

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

    const filters = { archived: false};
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
    });


});


    // // =========== UPDATE TASKS ===========
    export const updateTask = handleError(async (req, res, next) => {
        const { status, priority, dueDate } = req.body;
    
        const task = await taskModel.findById(req.query.id);
        if (!task) {
            return next(new AppError("Task not found", 404));
        }
    
        const oldValues = {
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
        };
    
        const updatedValues = {
            status: status ?? oldValues.status,
            priority: priority ?? oldValues.priority,
            dueDate: dueDate ?? oldValues.dueDate,
        };
    
        const changes = [];
        for (const field of Object.keys(updatedValues)) {
            if (updatedValues[field] !== oldValues[field]) {
                changes.push({
                    field,
                    oldValue: oldValues[field],
                    newValue: updatedValues[field],
                    type: `${field} updated`, 
                });
            }
        }
    
        if (changes.length === 0) {
            return next(new AppError("No changes made", 400));
        }
    
        await taskModel.findByIdAndUpdate(req.query.id, updatedValues, { new: true });
    
        for (const change of changes) {
            await logTaskChange({
                taskId: task._id,
                modifiedBy: req.user._id,
                changeType: change.type,
                oldValue: change.oldValue,
                newValue: change.newValue,
            });
        }
    
   
        res.status(200).json({ message: "Task updated successfully", newTask: updatedValues });
 });
  

// =========== DELETE TASKS =========== 
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

    await logTaskChange({
        taskId: task._id,
        modifiedBy: req.user._id,  
        changeType: "deleted",
        oldValue: JSON.stringify(task),
        newValue: null,
    });

    res.status(200).json({ msg: "Task deleted successfully" });
});


// =========== archive TASKS =========== 
export const archiveTask = handleError(async (req, res, next) => {

    const task = await taskModel.updateMany(
        { archived: false, status: "Done" },
        { $set: { archived: true } }
    );

    if ( task.modifiedCount === 0) {
        return next(new AppError("No tasks found", 404));
    }
    
    res.status(200).json({ msg: "Task archived successfully" });
});


// =========== RETRIEVE ARCHIVED TASKS =========== 
export const retrieveTasks = handleError(async (req, res, next) => {

    const {page = 1, limit = 10, sort} = req.query;

    const pageNum = parseInt(page, 10);
       const limitNum = parseInt(limit, 10);
       const skip = (pageNum - 1) * limitNum;
   
    
       let sortOption = {};
       if (sort) {
           const sortFields = ['dueDate', 'priority', 'status'];
           const sortField = sortFields.includes(sort) ? sort : 'dueDate'; 
           sortOption = { [sortField]: 1 }; 
       }
   
       const tasks = await taskModel.find({archived : true})
           .skip(skip)
           .limit(limitNum)
           .sort(sortOption); 
   
   
       if (!tasks.length) {
           return next(new AppError("No tasks found", 404));
       }
   
    const totalTasks = await taskModel.countDocuments({archived : true});
       const totalPages = Math.ceil(totalTasks / limitNum);
   
       res.status(200).json({ 
           totalTasks, 
           totalPages, 
           currentPage: pageNum, 
           tasks 
       });
   
});


// =========== RESTORE TASKS =========== 
export const restoreTask = handleError(async (req, res, next) => {

    const task = await taskModel.updateMany(
        {  archived: true ,status:"Done"},
        { $set: { archived: false } }
    );

    if (task.modifiedCount === 0) {
        return next(new AppError("No tasks found", 404));
    }

    res.status(200).json({ msg: "Task restored successfully" });
});
