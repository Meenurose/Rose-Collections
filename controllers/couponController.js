
mongoose = require('mongoose');


// const cartModel = require('../models/cartModel')
// const userModel = require('../models/userModel')
// const productModel = require('../models/productModel')
// const categoryModel = require('../models/categoryModel')
 const orderModel = require('../models/orderModel')
const couponModel = require('../models/couponModel')



///////////////////////////////////admin side///////////////////////////////////////////
const adminCoupons = async (req, res) => {
    try {
      const ITEMS_PER_PAGE =3 
      const page=parseInt(req.query.page) || 1
      const skipItems=(page-1) * ITEMS_PER_PAGE
      const totalCount=await orderModel.countDocuments()
      const totalPages=Math.ceil(totalCount/ITEMS_PER_PAGE)
      const coupon = await couponModel.find().skip(skipItems)
      .limit(ITEMS_PER_PAGE)
        console.log(coupon)        
       res.render("admin/adminCoupons", { coupon , currentPage:page, totalPages:totalPages});

       //res.render('admin/adminCoupons',{coupon})
      } catch (error) {
      console.log(error.message);
    }
  }
  
  const adminAddCoupon = async (req, res) => {
    try {
      res.render("admin/adminAddCoupon");
    } catch (error) {
      console.log(error.message);
    }
  }

  const adminAddCouponpost =  async (req, res) => {
    try {
          let coupon = req.body;
          await couponModel.create(coupon);
          res.redirect("/admin/coupons");
    } catch (error) {
      console.log(error.message);
    }
  }

 const adminEditCoupon = async (req, res) => {
    try {
        const couponId = req.query._id;
      const coupon = await couponModel.findById(couponId)
      res.render("admin/adminEditCoupon",{coupon});
    } catch (error) {
      console.log(error.message);
    }
  }

 const adminEditCouponpost = async (req, res) => {
  try {
        const couponId = req.body.id;
      const updatedCoupon = await couponModel.findById(couponId);
      updatedCoupon.code = req.body.code;
      updatedCoupon.description = req.body.description;
      updatedCoupon.discountType = req.body.discountType;
      updatedCoupon.discountAmount = req.body.discountAmount;
      updatedCoupon.minimumAmount = req.body.minimumAmount;
      updatedCoupon.expirationDate = req.body.expirationDate;
      updatedCoupon.maxRedemptions = req.body.maxRedemptions;
      
      await updatedCoupon.save();
      res.redirect("/admin/coupons");
  } catch (error) {
        console.log(error.message);
    }
  }


  ///////////////////////////////////////////////USER///////////////////////////////////////////////////

//     const userAddCoupon = async (req, res) => {
//     try {
//     //   const totalAmountInCart = req.query.total;
//     //   console.log(totalAmountInCart);

//     //   totalPrice
//       const currentDate = new Date();
//       const category = await categoryModel.find();
//       const coupons = await couponModel.find({
//         //minimumAmount: { $lt: totalAmountInCart },
//         minimumAmount: 100,
//         expirationDate: { $gt: currentDate },
//       }); 
//       console.log(coupons);
//       res.render("users/userCoupons", { coupons, category });
//     //res.render('users/userCoupons')
//     } catch (error) {
//       console.log(error.message);
//     }
//   }



  module.exports = {
    adminCoupons,
    adminAddCoupon,
    adminAddCouponpost,
    adminEditCoupon,
    adminEditCouponpost,
    //userAddCoupon
  }