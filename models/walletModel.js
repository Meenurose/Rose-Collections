const mongoose=require('mongoose')

const walletSchema= new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    balance:{
        type:Number,     
        default:0
    }
})

// const Wallet=mongoose.model('wallets',walletSchema, 'wallets')
// module.exports=Wallet;

module.exports(mongoose.model('wallets',walletSchema, 'wallets'))

