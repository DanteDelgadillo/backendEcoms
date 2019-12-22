const { Router } = require('express');
const fs = require('fs-extra')
const router = Router();
// cloudinary
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// Load user model
let Stock = require("../../models/Stock")



// @route   GET /getAllStock
// @desc    get All Stock
// @access  Public

router.get("/getAllStock", (req, res) => {
  Stock.find(function (err, Stock) {
    if (err) {
      console.log(err);
    } else {
      res.json(Stock);
    }
  })
})

// @route   POST /postStock
// @desc    POST post Stock
// @access  Public
router.post("/postStock", async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const newStock = new Stock({
    imageURL: result.secure_url,
    public_id: result.public_id,
    coralname: req.body.coralname,
    categories: req.body.categories,
    price: req.body.price,
    descrption: req.body.descrption,

  });
  await newStock.save()
    .then(newStock => {
      res
        .status(200)
        .json(newStock);
    })
    .catch(err => {
      res.status(400).json.send('adding new new Stock failed')
    })
  await fs.unlink(req.file.path);
})

// @route   delete /deleteStock/:id
// @desc    delete  Stock
// @access  Public
router.delete("/deleteStock/:id", async (req, res) => {
  const id = req.params.id;
  const stock = await Stock.findByIdAndDelete(id)
  await cloudinary.v2.uploader.destroy(stock.public_id)
    .then(Stock => {
      res.json('Stock deleted');
    })
    .catch(err => {
      res.status(400).send("delete no possible")
    })
})
module.exports = router;
