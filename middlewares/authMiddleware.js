const userModel = require("../models/userModel");

module.exports = {
    checkSession: async (req, res, next) => {
        //const { user } = req.session;
        // if (req.session.user.isActive !== true) {
        //     res.redirect('/')
        //     }
        // else if (req.session.user) next()        
        // else {
        //     res.redirect('/')
        // }

        try {
            const userId = req.session.user._id
            const user = await userModel.findById(userId)
            if (user.isActive) {
                next()
                return
            } else delete req.session.user
        } catch (error) {
            console.error(error)
            //return res.render("users/error404")
        }
        res.redirect('/')
        //res.redirect('/signin')
    },



    isAdminAuthorized: (req, res, next) => {
        if(req.session.admin) next()
        else res.redirect('/admin/login')
    },
}




