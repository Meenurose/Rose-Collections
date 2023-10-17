const sharp = require('sharp');
const { configDotenv } = require('dotenv')
const userModel = require('../models/userModel')
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const categoryHelper = require('../helpers/categoryHelper')


const adminCategory = async(req,res) => {     // to display the category list page for admin
    try{
        const category = await categoryModel.find()        
        res.render('admin/adminCategory',{ data: category})
    } catch (error){
        console.log(error.message)
    }
}

const adminAddCategoryPage = async(req,res) => {     // to render add category page of admin
    try{        
        res.render('admin/adminAddCategory',{errorMessage : ''})
    } catch (error){
        console.log(error.message)
    }
}

const adminAddCategory = async(req,res) => {        // to add category to db by admin
       // res.render('admin/adminCategory')
       console.log(req.body, " ADD category here");
       try {
         const category = req.body
         let categoryname= req.body.categoryname 

         const existingCategory = await categoryModel.findOne({ categoryname });
         if (existingCategory) {
            const errorMessage = "Categoryname already exists"; // Set the error message
            return res.render("admin/adminAddCategory", {errorMessage });

         }
         else{        
            await categoryHelper.addCategory(category)
             res.redirect('/admin/admincategory')
           }
           // console.log(eproducts,"here");
          } catch (error) {
           console.log('Failed to add Category:', error);
           res.status(500).send('Internal Server Error');
         }
 
}

const adminEditCategoryPage = async (req, res) => {         //to render edit category page of admin
    try {
      const categoryId = req.query._id;
      const category = await categoryModel.findById(categoryId);
      res.render('admin/adminEditCategory', { category });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

const adminEditCategory = async (req, res) => {                 //To edit categories by admin .
    try { 
      const category = req.body;
      const categoryId = req.body.id;
      console.log(categoryId)
      console.log(category)

      
      // Update the product with the new data,
      await categoryModel.findByIdAndUpdate(categoryId, { new: true });
      const updatedCategory = await categoryModel.findById(categoryId);
      updatedCategory.categoryname = req.body.categoryname;
      updatedCategory.description = req.body.description;
      await updatedCategory.save();
      res.redirect("/admin/admincategory");
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  module.exports ={
    adminCategory,
    adminAddCategoryPage,
    adminAddCategory,
    adminEditCategoryPage,
    adminEditCategory ,
  }