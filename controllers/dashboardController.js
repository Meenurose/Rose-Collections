const userHelper = require('../helpers/userHelper')
const userModel = require("../models/userModel")
const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const bannerModel = require('../models/bannerModel')


async function calculateCategorySales() {
    try {
      const categorySalesData = await orderModel.aggregate([
        {
          $unwind: '$items',
        },
        {
          $lookup: {
            from: 'items',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $unwind: '$productDetails',
        },
        {
          $match: {
            orderStatus: 'Delivered',
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'productDetails.categoryname',
            foreignField: 'categoryname',
            as: 'categoryDetails',
          },
        },
        {
          $unwind: '$categoryDetails',
        },
        {
          $group: {
            _id: '$productDetails.categoryname',
            categoryName: { $first: '$categoryDetails.categoryname' },
            totalSales: {
              $sum: { $multiply: ['$items.price', '$items.quantity'] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            categoryName: 1,
            totalSales: 1,
          },
        },
      ]);
  
      return categorySalesData;
    } catch (error) {
      throw error; 
    }
  }

///////////////////////////////////////////////////////////////////

async function calculateOnlineOrderCountAndTotal() {
    try {
      const onlineOrderData = await orderModel.aggregate([
        {
          $match: {
            paymentMode: 'onlinepayment', 
            orderStatus: 'Delivered', 
          },
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: '$finalPrice' }, 
            count: { $sum: 1 },
          },
        },
      ]);
  
      return onlineOrderData;
    } catch (error) {
      throw error; 
    }
  }  
  
  async function calculateCodOrderCountAndTotal() {
    try {
      const codOrderData = await orderModel.aggregate([
        {
          $match: {
            paymentMode: 'cashondelivery', 
            orderStatus: 'Delivered', 
          },
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: '$finalPrice' }, 
            count: { $sum: 1 },
          },
        },
      ]);
  
      return codOrderData;
    } catch (error) {
      throw error; 
    }
  }
   

///////////////////////////////////////////////////////////////////

const adminHome = async(req,res) => {
    try{
      
        const categorySales =await calculateCategorySales() 
        console.log("Category sales = ", categorySales)

        const onlinePay = await calculateOnlineOrderCountAndTotal()
        const codPay = await calculateCodOrderCountAndTotal()


        ////////////////////////////////////////////

      const orders = await orderModel.aggregate([
        {$match: { orderStatus: 'Delivered'} },
        {$group: {
          _id: { $dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
          total: {$sum : '$totalAmount'},
          count: {$sum : 1},
        },
      },
        {$sort: {_id: 1}},
      ])   

      const data = orders.map(({ _id, total, count }) => ({ date: _id, amount: total, count }))
      res.render('admin/adminHome', {data, categorySales, onlinePay:onlinePay[0], codPay:codPay[0]})

    } catch (error){
        console.log(error.message)
    }
}
///////////////////////////////////////////////////////


  



module.exports = {
    adminHome
    
}