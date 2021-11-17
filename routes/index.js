const router = require("express").Router();

const Category = require("../models/Category");
const FoodItem = require("../models/FoodItem");
const Order = require("../models/Order");

// get all categories
router.get("/categories", async (_, res) => {
  try {
    const allCategories = await Category.find();
    return res.status(200).json(allCategories);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// post a category
router.post("/add-category", async (req, res) => {
  const { name, image } = req.body;
  const newCategory = new Category({ name, image });
  try {
    const savedCategory = await newCategory.save();
    return res
      .status(201)
      .json({ message: `success: category ${savedCategory.name} added` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// post a new item into a category
router.post("/add-item", async (req, res) => {
  const { category, name, image, price, description } = req.body;
  const newItem = new FoodItem({ category, name, image, price, description });
  try {
    const savedItem = await newItem.save();
    return res.status(201).json({
      message: `success: item ${savedItem.name} added to category ${savedItem.name}`,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// get items from a category
router.get("/:category/items", async (req, res) => {
  try {
    const hasCategory = await Category.findOne({
      name: String(req.params.category).toLowerCase(),
    });
    if (!hasCategory)
      return res.status(404).json({ error: "category not available" });
    const reqItems = await FoodItem.find({
      category: String(req.params.category).toLowerCase(),
    });
    let items = [];
    reqItems.forEach(({ _id, name, image, price, description }) => {
      items.push({ _id, name, image, price, description });
    });

    return res.status(200).json({
      name: hasCategory.name,
      image: hasCategory.image,
      subItems: items,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/order", async (req, res) => {
  const newOrder = new Order({ items: req.body.items });
  try {
    const savedOrder = await newOrder.save();
    return res.status(201).json({ orderId: savedOrder._id });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/order/:order_id", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.order_id });
    if (!order) return res.status(404).json({ message: "order doesn't exist" });

    let items = [];
    const getOrderData = async (id) => {
      const item = await FoodItem.findOne({ _id: id });
      items.push(item);
    };

    await Promise.all(order.items.map(getOrderData));

    res.status(200).json({ _id: order._id, items });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put("/order/:order_id", async (req, res) => {
  try {
    const orderData = await Order.findOne({ _id: req.params.order_id });
    if (!orderData)
      return res.status(404).json({ message: "order doesn't exist" });

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.order_id },
      {
        items: [...orderData.items, req.body.itemId],
      },
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/order/:order_id/:item_id", async (req, res) => {
  try {
    const orderData = await Order.findOne({ _id: req.params.order_id });
    if (!orderData)
      return res.status(404).json({ message: "order doesn't exist" });
    if (orderData.items.includes(req.params.item_id)) {
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: req.params.order_id },
        {
          items: orderData.items.filter((id) => id !== req.params.item_id),
        },
        { new: true }
      );
      return res.status(200).json(updatedOrder);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/order/:order_id", async (req, res) => {
  try {
    const delOrder = await Order.findOneAndDelete({ _id: req.params.order_id });
    res.status(200).json({ orderId: delOrder._id });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
