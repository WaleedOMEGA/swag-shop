var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');
var cors = require('./node_modules/cors/lib/index')
var Product = require('./model/product');
var WishList = require('./model/wishlist');
const product = require('./model/product');
const wishlist = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/product', function (req,res) {
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            res.status(500).send({ error: "could not save product" });
        } else {
            res.send(savedProduct);
        }
    });
});

app.get('/product',function(req,res){
    Product.find({}, function (err, products) {
        if (err) {
            res.status(500).send({ error: "could not fetch products" });
        } else {
            res.send(products);
        }
    });
});

app.post('/wishlist', function (req, res) {
    var wishList = new WishList();
    wishList.title = req.body.title;
    wishList.save(function (err, newWishList) {
         if (err) {
             res.status(500).send({
                 error: "could not create wishList"
             });
         } else {
             res.send(newWishList);
         }
    })
});

app.get('/wishlist', function (req, res) {
    WishList.find({}).populate({
        path: 'products',
        model: 'product'
    }).exec(function (err, wishlists) {
        if (err) {
            res.status(500).send({
                error: "could not fetch wishlists"
            });
        } else {
            res.send(wishlists);
        }
    })
});

app.put('/wishlist/product/add', function (req, res) {
    product.findOne({ _id: req.body.productId }, function (err, product) {
        if (err) {
            res.status(500).send({
                error: "could not add item to wishlist"
            });
        } else {
            wishlist.update({ _id: req.body.wishListId }, { $addToSet: { products: product._id } }, function (err, wishlist) {
                if (err) {
                    res.status(500).send({
                        error: "could not add item to wishlist"
                    });
                } else {
                    res.send("successfuly added to wishlist");
                }
            });
        }
    });
});

app.listen(3004, function () {
    console.log('Swag Shop Api on Port 3004...');
});