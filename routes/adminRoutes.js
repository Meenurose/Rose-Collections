const express = require('express')
const adminRoute = express()
const auth = require('../middlewares/authMiddleware')

const adminController = require('../controllers/adminController')
const productController = require('../controllers/productController')
const categoryController = require('../controllers/categoryController')
const orderController =  require('../controllers/orderController')
const couponController =  require('../controllers/couponController')
const dashboardController = require('../controllers/dashboardController')

const productUpload = require("../multer/multerProduct")

adminRoute.get('/login', adminController.adminLogin)
adminRoute.post('/login', adminController.verifyAdmin)
adminRoute.get('/logout', auth.isAdminAuthorized, adminController.adminLogout)
// adminRoute.get('/adminhome', auth.isAdminAuthorized, adminController.adminHome)

adminRoute.get('/adminhome', auth.isAdminAuthorized, dashboardController.adminHome)

adminRoute.get('/userslist', auth.isAdminAuthorized, adminController.adminUsersList)
adminRoute.post('/blockunblock', auth.isAdminAuthorized, adminController.adminBlockUnblock)

adminRoute.get('/admincategory', auth.isAdminAuthorized, categoryController.adminCategory)
adminRoute.get('/adminaddcategory', auth.isAdminAuthorized, categoryController.adminAddCategoryPage)
adminRoute.post('/adminaddcategory', auth.isAdminAuthorized, categoryController.adminAddCategory)
adminRoute.get('/admineditcategory', auth.isAdminAuthorized, categoryController.adminEditCategoryPage)
adminRoute.post('/admineditcategory',auth.isAdminAuthorized, categoryController.adminEditCategory)

adminRoute.get('/adminproducts', auth.isAdminAuthorized, productController.adminProducts)
adminRoute.get('/addproduct', auth.isAdminAuthorized, productController.adminAddProductPage)
//adminRoute.post('/addproduct', auth.isAdminAuthorized, productUpload.array('file'), productController.adminAddProduct)
adminRoute.post('/addproduct', auth.isAdminAuthorized, productUpload.array("image",10), productController.adminAddProduct)  
adminRoute.get('/editproduct', auth.isAdminAuthorized, productController.adminEditProductPage)
adminRoute.post('/editproduct', auth.isAdminAuthorized, productUpload.array("image",10),productController.adminEditProduct)
adminRoute.post('/removeimages',auth.isAdminAuthorized,productController.adminDeleteImage);
//adminRoute.post('/removeimages/:',auth.isAdminAuthorized,productController.adminDeleteImage);
// Use a GET route for opening an image
// adminRoute.get('/product/:productId/image/:file', auth.isAdminAuthorized, productController.adminDeleteImage);


adminRoute.get('/coupons', auth.isAdminAuthorized, couponController.adminCoupons);
adminRoute.get('/addcoupon',auth.isAdminAuthorized,couponController.adminAddCoupon);
adminRoute.post('/addcoupon',auth.isAdminAuthorized,couponController.adminAddCouponpost);
adminRoute.get('/coupon/edit',auth.isAdminAuthorized,couponController.adminEditCoupon);
adminRoute.post('/editcoupon',auth.isAdminAuthorized,couponController.adminEditCouponpost);

adminRoute.get('/adminorderlists', auth.isAdminAuthorized, orderController.adminOrderLists);
adminRoute.get('/order/edit',auth.isAdminAuthorized,orderController.adminEditOrderLists);
adminRoute.post('/admineditorder',auth.isAdminAuthorized,orderController.adminEditOrderListPost);

adminRoute.get('/salesreport',auth.isAdminAuthorized,adminController.salesreport);
//adminRoute.post('/salesreportpost',auth.isAdminAuthorized,adminController.salesreportpost);

adminRoute.get('/reports/sales/download/:type',auth.isAdminAuthorized,adminController.adminDownloadReports);

adminRoute.get('/bannerlist',auth.isAdminAuthorized,adminController.adminBannerList);   
adminRoute.get('/addbanner',auth.isAdminAuthorized,adminController.adminAddbanner);
adminRoute.post('/addbanner',productUpload.single("images"),auth.isAdminAuthorized,adminController.adminAddedBanner);
adminRoute.get('/banner/edit',auth.isAdminAuthorized,adminController.adminEditBanner);
adminRoute.post('/editbanner',productUpload.single("images"),auth.isAdminAuthorized,adminController.adminEditedBanner);




module.exports = adminRoute