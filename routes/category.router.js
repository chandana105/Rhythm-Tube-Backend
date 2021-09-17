const express = require("express");
const router = express.Router();
const { Category } = require("../models/category.model.js");
const { extend } = require("lodash");


router
  .route("/")
  .get(async (_, res) => {
    try {
      const categories = await Category.find({}).populate('videos')     ;
      const message =
        categories.length === 0
          ? "There are no categories in the Collection, please start inserting them."
          : undefined;
      res.json({ success: true, categories, message });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to find categories",
        errorMessage: err.message,
      });
    }
  })
.post(async (req,res) => {
    try{
      const category = req.body;
      const NewCategory = new Category(category);
      const savedCategory = await NewCategory.save();
       res.json({ success: true, savedCategory });
    } catch (err) {
    res.status(500).json({
        success: false,
        message: "Unable to save category",
        errorMessage: err.message,
      });
    }
  })
    .delete(async (_, res) => {
    try {
      await Category.deleteMany({});
      res.status(200).json({
        success: true,
        deleted: true,
        message: "All Cateogries are deleted from this Collection",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        deleted: false,
        message: "Couldn't delete the Collection",
        errorMessage: err.message,
      });
    }
  });

router.param("categoryId", async (req, res, next, categoryId) => {
  try {
    const category = await Category.findById(categoryId).populate('videos');
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Couldn't get your category, Please check the categoryId again.",
      });
    }
    req.category = category;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Please check your categoryId again" });
  }
});

router
  .route("/:categoryId")
  .get((req, res) => {
    let { category } = req;
    category.__v = undefined;
    res.json({ success: true, category });
  })
  .post(async (req, res) => {
    const categoryUpdates = req.body;
    let { category } = req;
    category = extend(category, categoryUpdates);
    category = await category.save();
    res.json({ success: true, updatedCategory: category });
  })
  .delete(async (req, res) => {
    let { category } = req;
    await category.remove();
    res.json({ success: true, deletedCategory: category, deleted: true });
  });


module.exports = router;
