const userRoute = require('../routes/userRoutes')
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')
const orderModel = require('../models/orderModel')

const razorpay = require('../helpers/razorPay')
const crypto = require("crypto");
const { configDotenv } = require('dotenv')


////////////////////////////////////////user orders/////////////////////////////////


  const userOrderDetails = async (req, res) => {
    try {
      const category = await categoryModel.find();
      const orderId = req.params.id;
      const userId = req.session.user._id;
      const user = await userModel.findById(userId);
      const order = await orderModel.findById(orderId).populate("items.productId user");
      console.log(order)
          res.render("users/userOrderDetails", { order, user, category });
    } catch (error) {
      console.log(error.message);
      return res.render("users/error404");
    }
  }



  const userOrderConfirmation = async (req, res) => {
    try {
      const category = await categoryModel.find();
      const orderId = req.params.id;
      const userId = req.session.user._id;
      const user = await userModel.findById(userId);
      const order = await orderModel.findById(orderId).populate("items.productId user");
      console.log(order)
          res.render("users/userOrderConfirmation", { order, user, category });
    } catch (error) {
      console.log(error.message);
      return res.render("users/error404");
    }
  }
  
  
  const editOrderDetails =  async (req, res) => {
    try { 
      const orderId = req.params.id;
      const action = req.query.action
      console.log(orderId)

      //const order = await orderModel.find(userId : userI)

      if (action === 'cancel') {
        await orderModel.findByIdAndUpdate(orderId, {orderStatus: "Cancelled" });
      }
      else if (action === 'return') {
        await orderModel.findByIdAndUpdate(orderId, { orderStatus: "Returned" });
      }
  
      res.redirect("/home");
    } catch (error) {
      console.log(error.message);
      return res.render("users/error404");
    }
  }
  
  const orders = async (req, res) => {
    try {
      const userId = req.session.user._id;

      const ITEMS_PER_PAGE = 5
      const page = parseInt(req.query.page) ||1
      const skipItems = (page-1) * ITEMS_PER_PAGE      
      const totalCount=await orderModel.countDocuments({user : userId})
      const totalPages=Math.ceil(totalCount/ITEMS_PER_PAGE)

      const category = await categoryModel.find();      
      const user = await userModel.findById(userId);

      const order = await orderModel
        .find({ user: userId })
        .populate("items.productId")
        .sort({createdAt:-1})
        .skip(skipItems)
        .limit(ITEMS_PER_PAGE);

      res.render("users/userOrderLists", { order, user, category, currentPage:page, totalPages:totalPages });
    } catch (error) {
      console.log(error.message);
      return res.render("users/error404");
    }
  }

///////////////////////////////////////payment for orders/////////////////////////////

const userPayment = async (req, res) => {
  try{ 
  const category = await categoryModel.find();
  const { oid: orderId } = req.query;
  const order = await orderModel.findById(orderId);
  console.log("In userPayment controller function,, order= ", order);
  if (order.orderStatus === "pending") {
    res.render("users/userPayment", {
      category,
      order,
      razorpay_key: process.env.RAZORPAY_KEY_ID,
    });
  }
  } catch(error){
  console.log(error.message)
  return res.render("users/error404");
  }
}


const checkPayment = async (req, res) => {
  const userId = req.session.user._id;
  const { razorpayOrderId, razorpayPaymentId, secret } = req.body;
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
  let generatedSignature = hmac.digest("hex");
  if (generatedSignature == secret) {
    await orderModel.findOneAndUpdate(
      { "paymentData.id": razorpayOrderId },
      { orderStatus: "placed" }
    );
    await cartModel.findOneAndUpdate({ user: userId }, { products: [] });
    res.status(200).json({ success: true });
  } else {
      res.status(400).json({ success: false });
      //return res.render("users/error404");
  }   
}
//////////////////////////////////////// User Wallet Txn /////////////////////////////////


const walletTransaction = async (req, res) => {
  try {
    const userId = req.session.user_id;
    //const user = await userModel.findOne({ _id: userId }).sort({ dateOrdered: -1 });
    const user = await userModel.findOne({ _id: userId });
    res.render("users/userWalletTxn", { user });
  } catch (err) {
    console.log(err);
    return res.render("users/error404")
  }
};



////////////////////////////////////////admin orders/////////////////////////////////

const adminOrderLists = async(req,res) => {
    try {
      const ITEMS_PER_PAGE =10
      const page=parseInt(req.query.page) || 1
      const skipItems=(page-1) * ITEMS_PER_PAGE
      const totalCount=await orderModel.countDocuments()
      const totalPages=Math.ceil(totalCount/ITEMS_PER_PAGE)
      const order = await orderModel.find({})
       .populate('user')
       .sort({createdAt:-1})
       .skip(skipItems)
       .limit(ITEMS_PER_PAGE)

        res.render("admin/adminOrderLists",{order, currentPage:page, totalPages:totalPages});
        } catch (error) {
          console.log(error.message);
          return res.render("users/error404");
        } 
}


const adminEditOrderLists = async (req, res) => {
  try { 
    console.log('In adminEditOrderLists page');
    const orderId = req.query._id;
    const order = await orderModel.findById({_id:orderId}).populate('user items.productId')
    res.render("admin/adminOrderDetail",{order});
  } catch (error) {
    console.log(error.message);
    return res.render("users/error404");
  }
}


const adminEditOrderListPost = async (req, res) => {
  try { 
    const orderId = req.body.id;
    const orderStatus = req.body.status;
    console.log(orderStatus)
    await orderModel.findByIdAndUpdate(orderId, {orderStatus: orderStatus });
    res.redirect("/admin/adminorderlists");
  } catch (error) {
    console.log(error.message);
    return res.render("users/error404");
  }
}



  module.exports = { 
    userOrderDetails,
    userOrderConfirmation,
    editOrderDetails,
    orders,
    userPayment,
    checkPayment,
    walletTransaction,

    adminOrderLists,
    adminEditOrderLists,
    adminEditOrderListPost
  }