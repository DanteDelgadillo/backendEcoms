const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Stock = new Schema({
    coralname: String,
    categories: String,
    price: String,
    descrption: String,
    imageURL: String,
    public_id: String,
});


module.exports = mongoose.model("Stock", Stock);