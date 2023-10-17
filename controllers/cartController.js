const userRoute = require('../routes/userRoutes')
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')
const orderModel = require('../models/orderModel')
const couponModel = require('../models/couponModel')

const razorpay = require('../helpers/razorPay')
const { configDotenv } = require('dotenv')
const Swal =  require('sweetalert2')


const userCart = async(req,res) => {          // calls when simply accessing cart from any page
    try{
        const user1= req.session.user
        const userId = req.session.user._id
        console.log("In usercart controller page::: printing userId (req.session.user._id) ",userId)
        
        let cart = await cartModel.findOne({ user: userId });

        if (cart == null) {
        cart = await cartModel.create({ user: userId });    //if no cart, create cart for the user
        }

        cart = await cartModel
        .findOne({user : userId})
        .populate({path: "products.product"});

        console.log("In usercart controller page:: ")
        res.render('users/userCart', {cart})
      
    } catch(error){
        console.log(error.message)
    }
}


const addtocartpost = async (req, res) => {       // calls when 'add to cart' is clicked (eg. from PRoduct details page)
    const user1= req.session.user
    const userId = req.session.user._id
    
    console.log("In addtocartpost controller page::: printing userId (req.session.user._id)  ",userId)
    
    const { productId, quantity } = req.body;
    console.log("Req.body = ",req.body);
    //console.log("Req.body.quantitiy= ", req.body.quantity)
    
    try {
      let cart = await cartModel.findOne({ user: userId });
      if (cart == null) {
        cart = await cartModel.create({ user: userId });      //if no cart, create cart for the user
      }
      if (cart.products.length === 0) {
        cart.products.push({ product: productId, quantity });   //if  cart empty, adding the prdts, sent via the req
        res.status(200).json({ success: true });
      } else {
        let i;
        for (i = 0; i < cart.products.length; i++) {        //if prdts there already, updating the cart with the new products
          if (cart.products[i].product == productId) {       //if same prdt- update its quantity
            cart.products[i].quantity += Number(quantity);
            res.status(200).json({ success: true });

            break;
          }
        }

        console.log("i= ", i);
        if (i === cart.products.length) {                 //if no same prdt found in the cart, add(push) the new prdts to the end
          cart.products.push({ product: productId, quantity });
          res.status(200).json({ success: true });
        }
      }
      cart.save();
    
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }



  const removeFromCart = async (req, res) => {
    try {
      const { cartId, productId } = req.params;

      console.log("in removeFromCart cntrller function......")

      // Find the cartlist document by ID
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      // Find the index of the product in the "products" array
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );
      console.log("productIndex=......... ",productIndex);

      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

 
      // Remove the product from the "products" array
      cart.products.splice(productIndex, 1);
      console.log("Product deleted from cart")

      // Save the updated cartlist document
      const updatedCart = await cart.save();
      //return res.status(200).json({ message: "Product removed from cart" });
      res.redirect("/cart");
      // Respond with the updated cart or a success message
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      //return res.status(500).json({ error: "Internal server error" });
      return res.render("users/error404")
    }
  }




  const updatecartpost = async (req, res) => {
    const userId = req.session.user._id;
    const { productId, quantity } = req.body;
    console.log("In updatecartpost cntrller page..");
    try {
      let cart = await cartModel.findOne({ user: userId });

      if (cart.products.length === 0) {
        cart.products.push({ product: productId, quantity });
        res.status(200).json({ success: true });
      } else {
        let i;
        for (i = 0; i < cart.products.length; i++) {
          if (cart.products[i].product == productId) {
            cart.products[i].quantity = Number(quantity);
            res.status(200).json({ success: true });

            break;
          }
        }

        console.log("i=....",i);
        if (i === cart.products.length) {
          cart.products.push({ product: productId, quantity });
          res.status(200).json({ success: true });
        }
      }
      cart.save();
    } catch (error) {
      console.log(error.message);
      return res.render("users/error404")
    }
  }


  ////////////////////////////////////////////checkout/////////////////////////////////////////////////////////

  const userCheckOut= async(req,res) => {
    try{
      const category = await categoryModel.find();
      const coupon = req.query;         //trial..
      const userId = req.session.user._id;
      const cart = await cartModel
        .findOne({ user: userId })
        .populate({ path: "products.product" });
      const user = await userModel.findById(userId);

      console.log("In userCheckOut page, ")
  
      res.render("users/userCheckOut", { user, cart, category , coupon  });
  
    } catch(error){
        console.log(error.message)
        return res.render("users/error404")
    }
  }


const userCheckOutPost =  async (req, res) => {
  const user = req.session.user;
  //userId = user._id
  const { address, coupon, paymentType } = req.body;
  try {
    const cart = await cartModel
      .findOne({ user: user._id })
      .populate({
        path: "products.product",
        select: "price stock offer",
      })
      .select("-price");

    let updateOperations = [];
    let isAvailable = true;
    for (const item of cart.products) {
      if (item.quantity > item.product.stock) {
        isAvailable = false;
        break;
      }
      updateOperations.push({
        updateOne: {
          filter: { _id: item.product._id.toString() },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }

    if (!isAvailable) 
      return res
        .status(404)
        .json({ success: false, message: "Some items are out of stock" });

    const result = await productModel.bulkWrite(updateOperations);

    if (result.modifiedCount !== cart.products.length)
      return res
        .status(500)
        .json({
          success: false,
          message: "Something went wrong, Pls try again later",
        });

    const orderItems = [];
    cart.products.forEach((item) => {
      const discountPercentage = item?.product?.offer?.discountPercentage || 0
      const price = item.product.price * (1 - discountPercentage / 100)
      const tmp = {
        productId: item.product._id,
        quantity: item.quantity,
        price
      };
      orderItems.push(tmp);
    });


    const user2 = await userModel.findById(user._id)
    // TODO
    let addressdetail;
    user2.address.forEach((item) => {
      if (item._id.toString() == address) addressdetail = item;
    });

    let discountAmount = 0;
      if (coupon) {
        const coupons = await couponModel.findById(coupon);
        discountAmount = coupons.discountAmount;
      }
    
    const orderData = {
      user: user2,
      items: orderItems,
      address: addressdetail,
     // orderStatus : 'placed',
      discountAmount,
      paymentMode: paymentType,
      finalPrice: 0,
      totalAmount: 0,
    };
    const order = await orderModel.create(orderData);
    if (paymentType === "cashondelivery") {
      order.save();
      await cartModel.findOneAndUpdate({ user }, { products: [] });
      res.status(200).json({ success: true, url:`/orderdetails/${order._id}`});
    } 

    else if (paymentType === "onlinepayment") {         ////
      const razorpay_order = await razorpay.orders.create({
       amount: order.finalPrice * 100, 
        //amount: order.totalAmount * 100,        
        currency: "INR",
        receipt: order._id.toString(),
      });
      order.paymentData = razorpay_order;
      order.save();
      res.status(200).json({ success: true, url:`/orders/payment?oid=${order._id}`});
    }
    
    else {
      res
        .status(500)
        .json({ success: false, message: "Pls select a payment option" });
    }
  } catch (e) {
    console.error(e);
  }
}






  module.exports = { 
    userCart,
    addtocartpost,
    removeFromCart,
    updatecartpost,
    userCheckOut,
    userCheckOutPost,  
  }
