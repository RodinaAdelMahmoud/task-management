import { AppError } from "../../../utils/AppError.js";
import { handleError } from "../../../utils/globalErrorHandler.js";
import categoryModel from './../../../db/models/category.model.js';



// ADD CATEGORY
export const addCategory = handleError(async (req, res, next) => {
  const { title, type } = req.body;
  const category = await categoryModel.findOne({ title });
  if (category) {
    return next(new AppError("Category already exists", 409));
  }

  const newCategory = await categoryModel.create([{
    title,
    type,
    createdBy: req.user._id,
    tasks: [] 
  }]);

  res.status(200).json({ msg: "Category added successfully", newCategory });
  
})


// GET CATEGORIES
export const getCategories = handleError(async (req, res, next) => {
  const categories = await categoryModel.find();
  if (!categories) {
    return next(new AppError("Category not found", 404));
  
  }
  res.status(200).json({ categories })

})


// update CATEGORY
export const updateCategory = handleError(async (req, res, next) => {
    const { title ,newTitle} = req.body;
    const category = await categoryModel.findOneAndUpdate(
      { title } , { title: newTitle },
      { new: true }
    );
  
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  
    res.status(200).json({ msg: "Category updated successfully", category });
   
  
});



// delete CATEGORY
export const deleteCategory = handleError(async (req, res, next) => {
   const { title } = req.body;
  const category = await categoryModel.findOneAndUpdate({ title, isDeleted: false }, { isDeleted: true }, { new: true });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({ msg: "done" });
});





