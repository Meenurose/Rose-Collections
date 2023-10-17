const bodyParser = require('body-parser')
const adminRoute = require('../routes/adminRoutes')
const userRoute = require('../routes/userRoutes')
mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const sharp = require('sharp');
const moment = require("moment");
const { configDotenv } = require('dotenv')
const userModel = require('../models/userModel')
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const cropImage = require("../multer/prodImageCrop")


/////////////////////////////////////////////Productssssssss////////////////////////////////////////////////

const adminProducts = async(req,res) => {       // to display the product list page for admin
    try{
    //  const product = await productModel.find().populate('categoryname') 
    //  console.log(product)
    // res.render('admin/adminProducts', {data: product}) 

      const ITEMS_PER_PAGE =3 
      const page=parseInt(req.query.page) || 1
      const skipItems=(page-1) * ITEMS_PER_PAGE
      const totalCount=await productModel.countDocuments()
      const totalPages=Math.ceil(totalCount/ITEMS_PER_PAGE)
      const product = await productModel.find().populate('categoryname').skip(skipItems)
      .limit(ITEMS_PER_PAGE)

      //console.log(product)
      if (product) 
        res.render('admin/adminProducts', {data: product, currentPage:page, totalPages:totalPages })
    } catch (error){
        console.log(error.message)
    }
}
const adminAddProductPage = async(req,res) => {         // to render the add category page for admin
    try{
        const category = await categoryModel.find()  
        res.render('admin/adminAddProduct', { data: category })
    } catch (error){
        console.log(error.message)
    }
}



const adminAddProduct = async (req, res) => {
  let product = req.body;
  const image = [];
  if (req.files.length > 0) {
  for (let file of req.files) {
    const imageName = `cropped_${file.filename}`;
    await sharp(file.path)
        .resize(920, 920, { fit: "cover" })
        .toFile(`public/uploadProductImage/${imageName}`);

    image.push(imageName);
    }
    product.image= image;
  } else {
    return res.status(400).json({ success: false, message: 'Please choose product image files' });
  }

  try {console.log(product)
  await productModel.create(product);
  res.redirect("/admin/adminproducts");
  } catch (error) {
    console.log(error.message);
  }
}

   


  const adminEditProductPage = async (req, res) => {                 //To GET edit products page by admin .
    try {
        const productId = req.query._id;
        console.log("Prod id in adminEditProductPage", productId)
        const product = await productModel.findById(productId);
        //console.log("Productss ", product)
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const category = await categoryModel.find();
        res.render('admin/adminEditProduct', { productId:productId, products :product, category });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
      }
}

const adminEditProduct = async (req, res) => {
  try{
 
    //const id = req.body.id;
    const id = req.query._id;
    const product = req.body;
    const image = [];
    console.log("prod id in adminEditProduct,C..",id)
    const validProductId = new mongoose.Types.ObjectId(id);    //trial
    const updatedProductData = {
                      productname: req.body.productname,
                      categoryname: req.body.categoryname,
                      description: req.body.description,
                      stock: req.body.stock,
                     // color: req.body.color,
                      price: req.body.price,
                      mrp: req.body.mrp,
                      status : req.body.status,
                      'offer.discountPercentage': req.body.offerpercent,
                      'offer.specialConditions': req.body.offercondn
                    
                  };

  
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const imageName = `cropped_${file.filename}`;
  
        await sharp(file.path)
          .resize(920, 920, { fit: 'cover' })
          .toFile(`public/uploadProductImage/${imageName}`);
  
        image.push(imageName);
      }
      
    }
    // Update the product with the new data, including the images array if available
    await productModel.findByIdAndUpdate(id, { $push: { image: { $each: image } } }, { new: true });
    // await productlist.findByIdAndUpdate(id, { $set: { ...product } }, { new: true });

            // Find the product by ID and update the data
            const updateProduct = await productModel.findByIdAndUpdate(validProductId, updatedProductData);
    
            if (!updateProduct) {
                console.log('Product not found or not updated.');
                console.log('Invalid product ID:', validProductId);
                return res.status(404).send('Product not found or not updated.');
            } else {
                console.log('Product updated:');
                const products = await productModel.find();
                console.log('Product updated successfully');
                res.redirect('/admin/adminproducts');
            }


        } catch (error) {
          console.log(error.message);


        }
}


const adminDeleteImage = async (req, res) => {
        const { id, file } = req.body
        //const { id, file } = req.params
        console.log("Printing: id= ", id)
        console.log("Printing file...in adminDeleteImage cntrller",file)
        try {
          await productModel.findByIdAndUpdate(id, { $pull: { image: file } })
          res.status(200).json({ success: true })
          console.log("Image Successfully Deleted")
        } catch (error) {
          console.error(error.message)
          res.status(500).json({ success: false, message: 'Image deleting failed' })
        }
      }


////////////////////////////////////////////////////////////Offers//////////////////////////////////////////

  
/////////////////////////////////////////////////////////////USER //////////////////////////////////////////





module.exports = {
    adminProducts,
    adminAddProductPage,
    adminAddProduct,
    adminEditProductPage,
    adminEditProduct,
    adminDeleteImage
}

