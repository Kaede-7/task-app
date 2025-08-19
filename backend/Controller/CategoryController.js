const Category = require("../Model/categorySchema");

exports.createCategory = async (req, res) => {
  try {
    const { category, tasks } = req.body;
    const newCategory = new Category({ category, tasks });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("tasks", "title description");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const Id = req.params.id;
    const update = await Category.findByIdAndUpdate(Id, req.body, { new: true });
    res.json(update);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const Id = req.params.id;
    await Category.findByIdAndDelete(Id);
    res.send("Category deleted successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
