const userModel = require("../models/userModel");
const dbConnect = require("../config/dbConnection")
const bcrypt = require("bcrypt");

module.exports.addUser = async (userData, callback) => {
	console.log("Entered data in the form by user- in addUser helper fn- 1- ", userData)
   let mail = userData.email.trim().toLowerCase()
	//let { password } = data
	const count = await userModel.countDocuments({ email : mail })

	if (count > 0) callback("USER_ALREADY_EXISTS")
	else {
		let user1 = {
            name: userData.name,
            email: userData.email,
            phonenumber: userData.phonenumber,
            password: userData.password,
          };
	
		user1.password = await bcrypt.hash(userData.password, 10)
		console.log(user1, " checking before adding user to db");
		dbConnect().then( () => {
			userModel.create(user1)
			.then(() => {
				callback("DONE");
			})
			.catch(() => {
				callback("FAILED");
			});
		});
	//}
}
}

module.exports.getUser = (data) => {
	console.log(data,"- now at the userhelper getuser");
  return new Promise ((resolve, reject) => {
    dbConnect()
      .then( () => {
        userModel.findOne({ email: data.email })
          .then((user) => {
            // console.log(data,"lll");
            if (user) {
				console.log("At getuserHelper, user from DB - password:",data.password,"&&&&&","user.Password:",user.password);
				bcrypt.compare(data.password, user.password)
                .then((isMatch) => {
                  if (isMatch) {
                    
                    resolve(user);
                  } else {
                    
                    resolve(null);
                  }
                })
                .catch((error) => {
                  console.log('Error comparing passwords:', error);
                  reject(error);
                });
            } else {
              
              resolve(null);
            }
          })
          .catch((error) => {
            console.log('Failed to retrieve users:', error);
            reject(error);
          });
      })
      .catch((error) => {
        // console.log('haiiiiiii1234');
        console.log('Failed to connect to the database:', error);
        reject(error);
      });
  });
};


// module.exports.getAllUsers = async () => {
// 	try {
// 		const user = await dbConnect.get().collection(USER_COLLECTION).find().toArray()
// 		if (user) return user
// 		return false
// 	} catch (error) {
// 		console.error("Error getting users:", error)
// 		throw error
// 	}
// }


// module.exports.checkUser = async (data, callback) => {
//     console.log(data)
// 	let email=data.email
// 	const count = await userModel.findOne({ email })
// 		if(count)
// 		{
// 			let pass=await bcrypt.compare(data.password,count.password)
// 			if(pass)
// 			callback(true)
// 			else
// 			callback(false)
// 		}

// }