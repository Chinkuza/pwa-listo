const router = require("express").Router();
let Products = require("../models/products.model.js");

router.get("/", (req, res) => {
  Products.find({}, (err, data) => {
    if (err) return res.status(400).send(err);
    res.status(200).json(data);
  });
});
module.exports = router;
