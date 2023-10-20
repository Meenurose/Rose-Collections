const userRoute = require("../routes/userRoutes");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const couponModel = require("../models/couponModel");

const otpVerificationHelper = require("../helpers/otpVerificationHelper");
const userHelper = require("../helpers/userHelper");
const bcrypt = require("bcrypt");
const { configDotenv } = require("dotenv");
const cartModel = require("../models/cartModel");
const nodemailer = require("nodemailer");
const session = require("express-session");
const mongoose = require("mongoose");
const bannerModel = require("../models/bannerModel");
const wishlistModel = require("../models/wishlistModel");

const userLandingPage = async (req, res) => {
  try {
    let products = await productModel.find();
    let category = await categoryModel.find();

    const results = await productModel.aggregate([
      {
        $group: {
          _id: "$categoryname", // Group by category name
          count: { $sum: 1 }, // Count the number of products in each group
        },
      },
    ]);
   
    const categoriesWithCounts = await Promise.all(
      results.map(async (result) => {
        const category = await categoryModel.findOne({
          categoryname: result._id,
        });

        return {
          categoryid: result._id,
          count: result.count,
        };
      })
    );
    //console.log("categoriesWithCounts.categoryid & .count =..... ",categoriesWithCounts[0].categoryid, categoriesWithCounts[0].count);

    for (const categoryinfo of categoriesWithCounts) {
      // Find the product with the given ObjectId
      const product = await productModel
        .findOne({ categoryname: categoryinfo.categoryid })
        .populate("categoryname")
        .exec();

      if (product && product.categoryname) {
        const categoryName = product.categoryname.categoryname;
        categoryinfo.catname = categoryName;
      } else {
        console.log("Product not found or category not populated.");
      }
    }
    // console.log(
    //   "categoriesWithCounts =............. ",
    //   categoriesWithCounts
    // ); //correct

    res.render("users/userLandingPage", {
      products: products,
      category: categoriesWithCounts,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const userSignin = async (req, res) => {
  try {
    if (req.session.user) res.redirect("/home");
    else res.render("users/userSignin", { error: " " });
    //res.render('users/userHome')
  } catch (error) {
    console.log(error.message);
  }
};

const userSignout = async (req, res) => {
  try {
    req.session.user = false;
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};
const userSignup = async (req, res) => {
  try {
    res.render("users/userSignup", { signupmessage: "" });
  } catch (error) {
    console.log(error.message);
  }
};


///////////////////////////////////////////Function to validate email ///////////////////////////////////////
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
///////////////////////////////////////// ///////////////////////////////////////// /////////////////////////////////////////

const 
userSendOtp = async (req, res) => {
  try {
    console.log("In SendOtp function");
    // const phone = "+91" + req.body.phonenumber;
    const email = req.body.email;

    if (!validateEmail(email)) {
      res.json({ status: "Invalid Email. eg: give test@email.com" });
    } else if (email === "") {
      res.json({ status: "Email cannot be blank." });
    } else {
      // const user = await userModel.findOne({ email })                      //commentin, since, this wont work for Signup
      // if(!user){
      //   res.json({ status: "Can't find user with this email." });
      // }
      //}

      //const otpmessage = document.getElementById('otpmessage');
      const otpmessageId = req.body.otpmessageId;
      console.log("Testinggggg, trying otpmessage");

      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail", // Use your email service provider
        auth: {
          user: "meenu.roses20@gmail.com", //  email address
          pass: "uymzrgczhfagvmaw", //  email - app password
        },
      });

      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random OTP (6-digit number)
      req.session.otpSent = otp;

      //Email content
      const mailOptions = {
        from: "meenu.roses20@gmail.com", // Sender's email address
        to: email, // Recipient's email address
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`, // Message body with OTP
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.json({ status: "ERROR_SENDING_OTP" });
        } else {
          res.json({ status: "OTP_SEND" });
          console.log("Email sent:", info.response);
        }
      });

      // otpVerificationHelper.sendotp(phone, (status) => {         //otp for twilio
      //   if (status === "pending") {
      //     res.json({ status: "OTP_SEND" })
      //     console.log("Otp sent,, now in userSendOtp Controller function- otpVerificationHelper.sendotp(phone, (status) functional block")

      //   } else res.json({ status: "ERROR_SENDING_OTP" });
      // });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const userResetPassword = async (req, res) => {
  const otpSent = req.session.otpSent.toString();
  console.log("Otp sent thru mail = ", otpSent);
  otpWritten = req.body.otp;
  console.log("Otp written in the form = ", otpWritten);
  let message = {};

  if (otpSent === otpWritten) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) {
        console.log("User not found");
        message.text =
          "User not found. Can't find user with this email or some other error";
        return res.status(404).json({ message: "User not found" });
      }

      //   const userId= user._id
      //   const newPassword = await bcrypt.hash(password, 10);
      //   const updatedUser = userModel.findByIdAndUpdate(userId, { password: newPassword }, { new: true });

      //   console.log("password successfuy updatd for : ", updatedUser.name)
      //   message.text = "Password Changed successfully for user";
      //   res.status(200).json({ message: 'Password updated successfully', user: updatedUser });

      // } catch (error) {
      //   console.log(error.message);
      //   console.error("Error updating password:", error);
      //   // Handle the error and send an error response
      //   message.text = "An error occurred while updating the password";
      //   res.status(500).json({ message: 'Internal server error' });
      // }

      // Handle the error (e.g., return an error response)
      // console.log("User not foundd.....")
      // message.text = "User not found. Can't find user with this email ...or some other error ";
      // You can send a success response or perform further actions

      // if (user) {
      //   const updatedUser = new userModel({
      //     _id: user._id,
      //     password: await bcrypt.hash(password, 10), // Update password
      //   });
      //   await updatedUser.save();

      user.password = await bcrypt.hash(password, 10);
      await user.save();

      message.text = "Password Changed successfully";
      console.log("Passwrd changed....");
      // res.render('users/userForgotPswd', {message} )
    } catch (error) {
      console.log(error.message);
    }
  } else {
    console.log("Otp incorrect. Please try again,,,,,,");
    message.text = "Otp incorrect. Please try again";
  }
  res.render("users/userForgotPswd", { message });
};

const userSignedup = async (req, res) => {
  try {
    console.log("In userSignedUp function");
    const phone = "+91" + req.body.phonenumber;
    //await sendVerifyMail(req.body.name, req.body.email, userData._id);

    const otp = req.body.otp;
    //const signupmessage = req.body.signupmessage

    //otpVerificationHelper.verifyotp(phone, otp, (status) => {
    //  console.log(status);
    // if (status === "approved") {
    const { name, phonenumber, email, password } = req.body;
    let data = {
      name: name,
      phonenumber: phonenumber,
      email: email,
      password: password,
    };
    userHelper.addUser(data, (stat) => {
      console.log(stat);
      if (stat == "DONE") {
        //res.redirect("/signin");
        res.render("users/userSignUp", { signupmessage: "Account created" });
      } else {
        //USER_ALREADY_EXISTS

        console.log("User already exists. Please try again with new email");
        // signupmessage.textcontent = "User already exists. Please try again with new emailllll"
        res.render("users/userSignUp", {
          signupmessage: "User already exists. Please try again with new email",
        });
      }
    });
    // }
    // });
  } catch (error) {
    console.log(error.message);
  }
};

const userSigninPage = async (req, res) => {
  console.log("In userSigninPage..");
  const { email, password } = req.body;
  let data = { email: email, password: password };
  //console.log(" printing req.body", data);

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and Password required" });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");
    // console.log("User from db ", user)
    if (!user) {
      return res.render("users/userSignin", {
        error: "Invalid Email or Password",
      });
    }
    const status = await bcrypt.compare(data.password, user.password);

    if (!status) {
      return res.render("users/userSignin", {
        error: "Invalid Email or Password",
      });
    }

    if (!user.isActive) {
      return res.render("users/userSignin", {
        error: "This Account is Blocked. Please contact the administrator",
      });
    }

    req.session.user = user;
    console.log("Checked user, true, redirecting/ (rendering) to home page");
    res.redirect("/home");
    //res.render('users/userHome')
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};


const userProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.session?.user?._id;
    let product
    try {
      product = await productModel.findOne({ _id: productId });
    } catch (e) {
      return res.render("users/error404");
    }

    let isWishlisted = false;

    if (userId) {
      let wishlist = await wishlistModel.findOne({ user: userId });
      if (wishlist) {
        for (const item of wishlist.items) {
          if (item.product.toString() === productId) {
            isWishlisted = true;
            break;
          }
        }
      }
    }

    if (isWishlisted == false)
      console.log("This Product NOT present in wishlist..");

    if (!product) {
      return res.render("users/error404");
    }

    //checking for offer:
    if (product.offer) {
      console.log(
        "Printing offer details::",
        product.offer.specialConditions,
        product.offer.discountPercentage
      );
    }

    res.render("users/userProductDetails", { product, isWishlisted , userId });
  } catch (error) {
    console.error(error);
    return res.render("users/error404");
    //res.status(500).json({ error: "Internal Server Error" });
  }
};

const userProductLists = async (req, res) => {
  try {
    /// finding category with counts of products
    const results = await productModel.aggregate([
      {
        $group: {
          _id: "$categoryname", // Group by category name
          count: { $sum: 1 }, // Count the number of products in each group
        },
      },
    ]);
   
    const categoriesWithCounts = await Promise.all(
      results.map(async (result) => {
        const category = await categoryModel.findOne({
          categoryname: result._id,
        });

        return {
          categoryid: result._id,
          count: result.count,
        };
      })
    );

    //console.log("categoriesWithCounts.categoryid & .count =..... ",categoriesWithCounts[0].categoryid, categoriesWithCounts[0].count);

    for (const categoryinfo of categoriesWithCounts) {
      // Find the product with the given ObjectId
      const product = await productModel
        .findOne({ categoryname: categoryinfo.categoryid })
        .populate("categoryname")
        .exec();

      if (product && product.categoryname) {
        const categoryName = product.categoryname.categoryname;
        categoryinfo.catname = categoryName;
      } else {
        console.log("Product not found or category not populated.");
      }
    }
    console.log(
      "categoriesWithCounts =....... "); //correct

    // categry with count ends
    const ITEMS_PER_PAGE = 3;
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const totalCount = await productModel.countDocuments();
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const products = await productModel
      .find()
      .populate("categoryname")
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    console.log(products);
    if (products)
      res.render("users/userProductLists", {
        products,
        currentPage: page,
        totalPages: totalPages,
        category: categoriesWithCounts,
      });
  } catch (error) {
    console.log(error.message);
    return res.render("users/error404");
  }

  ////////////////////tried sortingg

  // try{      Working code
  //     //console.log("Printing req.session.user- ",req.session.user)
  //     let products = await productModel.find()
  //     res.render('users/userProductLists', {products: products})
  //   }  catch(error){
  //   console.log(error.message)
  // }

  // try {
  //   //const { categoryId } = req.params
  //   const category = await categoryModel.find({});
  //   const page  = req.query.page || 1
  //   let categoryID
  //  // if(categoryId!='all')
  //   categoryID = await categoryModel.findById(categoryId)

  // const decodedURL = decodeURIComponent(req.query.f)

  // const sortStatus = req.query.sort
  // const sort = {}
  // if (sortStatus === 'price-asc') sort.price = 1
  // else if (sortStatus === 'price-dec') sort.price = -1
  // else if (sortStatus === 'new') sort.createdAt = -1

  // let filter = {}

  // const query = req.query.q || ''
  // const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // if (escapedQuery !== 'undefined') {
  //   filter = { productname: { $regex: new RegExp(escapedQuery, 'i') }
  //       },

  //     { title: 1 }
  // } else {
  //   filter.status = 'Listed'
  // }
  // console.log("Decoded url = ", decodedURL)
  // if (decodedURL !== 'undefined') {
  // filter.price= {
  //   $gte: decodedURL.split(",")[0],
  //   $lte: decodedURL.split(",")[1]
  // }

  // } else {filter.status = 'Listed'}

  //     const categories = await categoryModel.aggregate([

  //       { $group: { _id: null, values: { $push: '$categoryname' } } },
  //     ])

  // const RESULTS_PER_PAGE=3
  //if (categoryId !== 'all')
  //filter.categoryname = categoryID._id
  // const documentCount = await productModel.countDocuments(filter)
  // let products = await productModel.find(filter)
  //   .sort(sort)
  //   .skip((page - 1) * RESULTS_PER_PAGE)
  //   .limit(RESULTS_PER_PAGE)
  // const totalPages = Math.ceil(documentCount / RESULTS_PER_PAGE)

  // const filterOptionsCounts = await productModel.aggregate([
  //   {
  //     $match: filter

  //   },
  //   {
  //     $bucket: {
  //       groupBy: "$price",
  //       boundaries: [100, 200, 300,400,500], // Define your range boundaries here
  //       default: "Other", // Default bucket name for values outside the specified ranges
  // output: {
  //   count: { $sum: 1 },
  //   values: { $push: "$price" }
  // }
  //     }
  //   }
  // ])
  // console.log(filterOptionsCounts)

  // res.render('users/userProductLists', {
  //   products,
  //   categories: categories[0].values,
  //   filterOptionsCounts,
  //   decodedURL,
  //   currentPage:page,
  //   totalPages,
  //   searchQuery: query,
  //   categoryId,
  //   category
  // })
  // catch (error) {
  //   //next(error)
  //   console.log(error.message)
  // }
};

const userCategoryProds = async (req, res) => {
  try {
    const catId = req.params.id;

    //to get catname:

    // categoryModel.findOne({ _id: catId })
    //   .then((category) => {
    //     if (!category) {
    //       // Handle the case where the category with the specified _id is not found
    //       console.log("Category not found");
    //       return;
    //     }

    //     // Access the categoryname
    //     const categoryName = category.categoryname;
    //     console.log("Category Name:", categoryName);
    //   })
    //   .catch((error) => {
    //     console.error("Error retrieving category:", error);
    //   });

    const category = await categoryModel.findOne({ _id: catId });
    const categoryname = category.categoryname;
    console.log("Category name== ", categoryname);

    ////////////
    const products = await productModel.find({ categoryname: catId });

    const ITEMS_PER_PAGE = 3;
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const totalCount = 9;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const prods = await productModel
      .find()
      .populate("categoryname")
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);
    
    const count = await productModel.countDocuments({categoryname:catId})

    if (prods)
      res.render("users/userCategoryProds", {
        products,
        currentPage: page,
        totalPages: totalPages,
        catId,
        categoryname,
        count
      });

  } catch (error) {
    console.log(error.message);
    return res.render("users/error404");
  
  }
};

const userForgotPswd = async (req, res) => {
  try {
    res.render("users/userForgotPswd", { message: " " });
  } catch (error) {
    console.log(error.message);
    return res.render("users/error404");
  
  }
};

const userHome = async (req, res) => {
  try {
    if (!req.session.user) res.redirect("/");
    else {
      //console.log("Printing req.session.user- ",req.session.user)
      user = req.session.user;
      let products = await productModel.find();
      let banner = await bannerModel.find();
      res.render("users/userHome", { products: products, user, banner });
    }
  } catch (error) {
    console.log(error.message);
    return res.render("users/error404");
  
  }
};

//////////////////////////////////////////////User Profile /////////////////////////////////////////

const userProfile = async (req, res) => {
  try {
    const category = await categoryModel.find();
    const userId = req.session.user._id;
    const user = await userModel.findById(userId);

    res.render("users/userProfile", { user, category });
  } catch (error) {
    console.log(error.message);
    return res.render("users/error404");
  
  }
};

const userProfileUpdated = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { email, phonenumber },
      { new: true }
    );
    res.render("users/userProfile", { user });
  } catch (error) {
    console.log(error.message);
  }
};

const userAddAddress = async (req, res) => {
  try {
    const category = await categoryModel.find();
    const userId = req.session.user._id;
    const user = await userModel.findById(userId);
    res.render("users/userAddAddress", { user, category });
  } catch (error) {
    console.log(error.message);
  }
};

const userAddAddressPost = async (req, res) => {
  try {
    //const category = await categoryModel.find();
    const userId = req.session.user._id;

    const name = req.body.name
    const email = req.body.email
    const phonenumber = req.body.phonenumber

    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          address: {
            name: name,
            email : email,
            phonenumber : phonenumber,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
          },
        },
      },
      { new: true }
    );

    res.render("users/userProfile", { user });
  } catch (error) {
    console.log(error.message);
  }
};

const addAlternateAddress = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const name = req.body.name
    const email = req.body.email
    const phonenumber = req.body.phonenumber

    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          address: {
            name: name,
            email : email,
            phonenumber : phonenumber,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
          },
        },
      },
      { new: true }
    );
    res.redirect("/checkout");
  } catch (error) {
    console.log(error.message);
  }
};

const userEditAddress = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const name = req.query.name;
    const email = req.query.email;
    const phonenumber = req.query.phonenumber;

    const addressId = req.query.addressId;
    const address = req.query.address;
    const city = req.query.city;
    const state = req.query.state;
    const pincode = req.query.pincode;

    res.render("users/userEditAddress", {
      addressId,
      name,
      phonenumber,
      email,
      address,
      city,
      state,
      pincode,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const userEditAddresspost = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const addressId = req.query.addressId;
    console.log("Address id= req.query.addressId ", addressId);

    const name = req.body.name;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;

    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;

    const user = await userModel.findOneAndUpdate(
      { _id: userId, "address._id": addressId }, // Match the user and address ID
      {
        $set: {
          "address.$.name": name,
          "address.$.email": email,
          "address.$.phonenumber": phonenumber,
          "address.$.address": address,
          "address.$.city": city,
          "address.$.state": state,
          "address.$.pincode": pincode,
        },
      },
      { new: true }
    );

    res.redirect("/checkout");
  } catch (error) {
    console.log(error.message);
  }
};

///////////////////////////////////////////////couponss///////////////////////////////////////

const userAddCoupon = async (req, res) => {
  try {
    const totalAmountInCheckout = req.query.total;
    console.log("Total Amount in Checkout ,from userAddCoupon Controller",totalAmountInCheckout);

    const currentDate = new Date();
    const category = await categoryModel.find();
    const coupons = await couponModel.find({
      minimumAmount: { $lt: totalAmountInCheckout },
      expirationDate: { $gt: currentDate },
    });
    console.log(coupons);
    res.render("users/userCoupons", { coupons, category });
  } catch (error) {
    console.log(error.message);
  }
};

const userAddCouponpost = async (req, res) => {
  const shouldRedirect = true;
  if (shouldRedirect) {
    res.json({ redirect: true });
  } else {
    res.json({ redirect: false });
  }
};

////////////////////////////////////////////////Search codes///////////////////////////////////////

const userSearch = async (req, res, next) => {
  try {
    const query = req.query.query;
    const regex = new RegExp(query, "i");
    const searchResults = await productModel.find({
      $or: [
        { productname: regex },
        // Add other fields to search if needed
      ],
    });

    const ITEMS_PER_PAGE = 3;
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const totalCount = searchResults.length;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    res.render("users/userSearch", {
      results: searchResults,
      query: query,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

//////////////////////////////////////////

const userSearchCat = async (req, res, next) => {
  try {
    const query = req.query.query;
    const regex = new RegExp(query, "i");
    const catId = req.params.id
    
    const category = await categoryModel.findOne({ _id: catId });
    const categoryname = category.categoryname;
    console.log("Category name== ", categoryname);


    const searchResults = await productModel.find({
      $and: [
        {categoryname : catId}, 
      {     
      $or: [
        { productname: regex },
        // Add other fields to search if needed
      ],
    },
    ],
    });

    const ITEMS_PER_PAGE = 3;
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const totalCount = searchResults.length;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    res.render("users/userSearch", {
      results: searchResults,
      query: query,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


// const products = await productModel.find().populate('categoryname').skip(skipItems)
// .limit(ITEMS_PER_PAGE)

// console.log(products)
// if (products)
//   res.render('users/userProductLists', {products, currentPage:page, totalPages:totalPages })
// }

// const userSearch = async (req,res,next) =>{
//   let sort=req?.query?.sort;
//   let categories=req?.query?.category?.split(',')
//   let search=req?.query?.search
//   // const finalElements = categories.slice(0, -1);
//   // console.log(categories)
//         const category=await categoryModel.find({})
//         const productCountByCategory = await productModel.aggregate([
//             {
//               $group: {
//                 _id: "$categoryname", // Group products by category
//                 productCount: { $sum: 1 }, // Calculate the count of products in each group
//               },
//             },
//           ]);
//     try {
//         let products
//         if(!categories){
//           products=await productModel.find({})
//           categories=[]
//         }else if(categories){
//           products=await  productModel.aggregate([
//             {
//               $lookup: {
//                 from: 'categories', // Replace with the actual name of the referenced collection
//                 localField: 'categoryname', // Replace with the field in the current collection that references the other collection
//                 foreignField: '_id', // Replace with the field in the referenced collection to match against
//                 as: 'category' // Name for the array of matching documents from the referenced collection
//               }
//             },
//             {
//               $match: {
//                 'category.categoryname': { $in: categories }
//               }
//             }
//           ])
//         }

//         if(sort=='lowtohigh'){
//          products= products.sort(function(a,b){
//             return a.price-b.price
//           })
//         }else if(sort=='hightolow'){
//           products= products.sort(function(a,b){
//             return b.price-a.price
//           })
//         }

//         if(search){
//          products=products.filter((product,index)=>{
//             return product.productname.startsWith(search)
//           })
//         }

//          req.session.filteredProducts=products

//         res.render('user/searchPage',{layout:'./layout/homeLayout',
//             products:req.session.filteredProducts,
//             category,
//             categories,
//             productCountByCategory,
//             isLoggedIn:true,
//             searchInput:search
//         })

//     } catch (error) {
//         console.log(error.message)
//     }
// }

//////////////////////////////////////////////User Sortinggg/////////////////////////////////////////

const userSortPrice = async (req, res) => {
  try {
    const results = await productModel.aggregate([
      {
        $group: {
          _id: "$categoryname", // Group by category name
          count: { $sum: 1 }, // Count the number of products in each group
        },
      },
    ]);

    const categoriesWithCounts = await Promise.all(
      results.map(async (result) => {
        const category = await categoryModel.findOne({
          categoryname: result._id,
        });

        return {
          categoryid: result._id,
          count: result.count,
        };
      })
    );

    for (const categoryinfo of categoriesWithCounts) {
      // Find the product with the given ObjectId
      const product = await productModel
        .findOne({ categoryname: categoryinfo.categoryid })
        .populate("categoryname")
        .exec();

      if (product && product.categoryname) {
        const categoryName = product.categoryname.categoryname;
        categoryinfo.catname = categoryName;
      } else {
        console.log("Product not found or category not populated.");
      }
    }
    console.log(
      "categoriesWithCounts =.......... ",
      categoriesWithCounts
    ); //correct

    // cat with count ends

    //sorting
    const { sortOption } = req.query;
    let sortCriteria = {};
    if (sortOption === "2") {
      sortCriteria = { price: 1 }; // Sort by Price: Low to High
    } else if (sortOption === "3") {
      sortCriteria = { price: -1 }; // Sort by Price: High to Low
    }
    // const sortedProducts = await productModel.find().sort(sortCriteria);
    //res.render('sortedproducts', { products: sortedProducts });
    // sorting ends

    const ITEMS_PER_PAGE = 3;
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const totalCount = await productModel.countDocuments();
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const sortedProducts = await productModel
      .find()
      .sort(sortCriteria)
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);
    //   .limit(ITEMS_PER_PAGE);;

    // const products = await productModel
    //   .find()
    //   .populate("categoryname")
    //   .skip(skipItems)
    //   .limit(ITEMS_PER_PAGE);

    //console.log(products);
    if (sortedProducts)
      res.render("users/userSortPrice", {
        products: sortedProducts,
        currentPage: page,
        totalPages: totalPages,
        category: categoriesWithCounts,
        sortOption,
      });

    //res.render("users/userSortPrice" );
  } catch (error) {
    console.log(error.message);
  }
};

//////////////////////////////////////////////User Wishlist/////////////////////////////////////////

const userWishlist = async (req, res) => {
  try {
    const user1 = req.session.user;
    const userId = req.session.user._id;
    console.log( "In userwishlist controller page::: printing userId (req.session.user._id)  ", userId );

    let wishlist = await wishlistModel.findOne({ user: userId });

    if (wishlist == null) {
      wishlist = await wishlistModel.create({ user: userId }); //if no wishlist, create wishlist for the user
    }

    wishlist = await wishlistModel
      .findOne({ user: userId })
      .populate({ path: "items.product" });

    console.log("In user wishlist controller page:: " );

    res.render("users/userWishlist", { wishlist });
  } catch (error) {
    console.log(error.message);
  }
};

const addtowishlistpost = async (req, res) => {
  const user1 = req.session.user;
  const userId = req.session.user._id;

  console.log(
    "In addtowishlistpost controller page::: printing userId (req.session.user._id) (not user1) ", userId );

  const { productId } = req.body;
 // console.log("Req.body = ", req.body);
  //console.log("Req.body.quantitiy= ", req.body.quantity)

  try {
    let wishlist = await wishlistModel.findOne({ user: userId });
    if (wishlist == null) {
      wishlist = await wishlistModel.create({ user: userId }); //if no wishlist, create wishlist for the user
    }
    if (wishlist.items.length === 0) {
      wishlist.items.push({ product: productId }); //if  wishlist empty, adding the prdts, sent via the req
      res.status(200).json({ success: true });
    } else {
      let i;
      for (i = 0; i < wishlist.items.length; i++) {
        if (wishlist.items[i].product == productId) {
          res.status(200).json({ success: true });
          break;
        }
      }
      console.log("i= ", i);
      if (i === wishlist.items.length) {
        wishlist.items.push({ product: productId });
        res.status(200).json({ success: true });
      }
    }
    wishlist.save();
  } catch (error) {
    console.error(error.message);
    return res.render("users/error404");
  
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { wishlistId, productId } = req.params;
    console.log("in removeFromWishlist cntrller function...");

    const wishlist = await wishlistModel.findById(wishlistId);

    if (!wishlist) {
      console.log("Error: wishlist not found" );
      return res.render("users/error404");
    }

    const productIndex = wishlist.items.findIndex(
      (product) => product.product.toString() === productId
    );
    console.log("productIndex=......... ", productIndex);

    if (productIndex === -1) {
      console.log("Error: Product not found in wishlist");
      return res.render("users/error404");
    }
    wishlist.items.splice(productIndex, 1);
    console.log("Product deleted from wishlist");

    const updatedWishliat = await wishlist.save();
    res.redirect("/wishlist");

  } catch (error) {
    console.error("Error deleting product from wishlist:", error);
    return res.render("users/error404");
  }
};

module.exports = {
  userLandingPage,
  userSignin,
  userSignout,
  userSignup,
  userSendOtp,
  userResetPassword,
  userSignedup,
  userSigninPage,
  userProductDetails,
  userProductLists,
  userCategoryProds,

  userForgotPswd,
  userHome,
  userProfile,
  userProfileUpdated,
  userAddAddress,
  userAddAddressPost,
  addAlternateAddress,
  userEditAddress,
  userEditAddresspost,

  userAddCoupon,
  userAddCouponpost,

  userSearch,
  userSearchCat,
  userSortPrice,

  userWishlist,
  addtowishlistpost,
  removeFromWishlist,
};
