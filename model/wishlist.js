var mongoose = require('mongoose');
var schema = mongoose.Schema;
var objectId = mongoose.Schema.Types.ObjectId;
var wishList = new schema({
    title: { type: String, default: "cool wish list" },
    products:[{type:objectId,ref:'product'}]
});
module.exports = mongoose.model('wishList', wishList);