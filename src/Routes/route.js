const express = require('express');
const router = express.Router();
const itemController = require("../Controllers/itemController")
const orderController = require("../Controllers/orderController")

router.post("/createItem", itemController.createItem);
router.get("/getItem", itemController.getItem);
router.post("/createOrder", orderController.createOrder);
router.get("/getOrder", orderController.getOrders);

module.exports = router;