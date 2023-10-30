const express = require('express')
const userRoute = express()
const bodyParser = require('body-parser')
const auth = require('../middlewares/authMiddleware')

userRoute.use(bodyParser.json())
userRoute.use(bodyParser.urlencoded({ extended: true}))

const userController = require('../controllers/userController')
//const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController =  require('../controllers/orderController')
//const couponController = require('../controllers/couponController')

userRoute.get('/', userController.userLandingPage)
userRoute.get('/signin', userController.userSignin)
userRoute.post('/signin', userController.userSigninPage)

userRoute.get('/signout', auth.checkSession, userController.userSignout)

userRoute.get('/signup', userController.userSignup)
userRoute.post('/sendotp', userController.userSendOtp)
userRoute.post('/verifyotp', userController.userSignedup) 
userRoute.post('/resendOtp', userController.userResendOtp)  
//userRoute.post('/signup', userController.userSignedup)

userRoute.get('/forgotpassword', userController.userForgotPswd)
userRoute.post('/resetpassword', userController.userResetPassword)

userRoute.get('/home', auth.checkSession, userController.userHome)

userRoute.get('/productdetails/:id', userController.userProductDetails)
//userRoute.get('/products/category/:categoryId', userController.userProductLists)
userRoute.get('/products', userController.userProductLists)

userRoute.get('/categoryproducts/:id', userController.userCategoryProds)
userRoute.get('/sortedproducts', userController.userSortPrice)

userRoute.get('/sortpricecatproducts/:id', userController.userSortPriceCat)


userRoute.get('/wishlist', auth.checkSession, userController.userWishlist) 
userRoute.post('/wishlist', auth.checkSession, userController.addtowishlistpost) 
userRoute.get('/wishlist/:wishlistId/product/:productId', auth.checkSession,userController.removeFromWishlist);

userRoute.get('/cart', auth.checkSession, cartController.userCart)
userRoute.post('/addtocart', auth.checkSession, cartController.addtocartpost)
userRoute.get('/cart/:cartId/product/:productId', auth.checkSession,cartController.removeFromCart);
userRoute.post('/updatecart', auth.checkSession, cartController.updatecartpost)

userRoute.get('/userprofile', auth.checkSession, userController.userProfile)
userRoute.post('/userprofile', auth.checkSession, userController.userProfileUpdated)
userRoute.get('/addaddress', auth.checkSession, userController.userAddAddress)
userRoute.post('/addaddress', auth.checkSession, userController.userAddAddressPost)
userRoute.post('/addAlternateAddress', auth.checkSession, userController.addAlternateAddress)
userRoute.get('/editaddress', auth.checkSession, userController.userEditAddress)
userRoute.post('/editaddress', auth.checkSession, userController.userEditAddresspost)

userRoute.get('/usecoupon', auth.checkSession, userController.userAddCoupon)
userRoute.post('/addcoupon',  auth.checkSession, userController.userAddCouponpost);

userRoute.get('/checkout/:id?', auth.checkSession,cartController.userCheckOut);
userRoute.post('/checkoutpost', auth.checkSession, cartController.userCheckOutPost);

userRoute.get('/orders/payment',auth.checkSession, orderController.userPayment);
userRoute.post('/orders/check-payment', auth.checkSession,orderController.checkPayment);

userRoute.get('/orderdetails/:id', auth.checkSession, orderController.userOrderDetails); 
//userRoute.get('/orderdetails/:id', auth.checkSession, orderController.userOrderConfirmation);
userRoute.get('/orderconfirmation/:id', auth.checkSession, orderController.userOrderConfirmation);
userRoute.get('/editorderdetails/:id', auth.checkSession, orderController.editOrderDetails);
userRoute.get('/orders', auth.checkSession, orderController.orders);

userRoute.get('/wallettransaction',auth.checkSession,orderController.walletTransaction)

userRoute.get('/search', userController.userSearch)

userRoute.get('/searchCat/:id', userController.userSearchCat)


module.exports = userRoute