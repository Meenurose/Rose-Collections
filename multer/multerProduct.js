// const path = require('path')
// const multer = require('multer')


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { 
//       cb(null, 'public/uploadProductImage');
//     },
//     filename: (req, file, cb) => {
//       console.log(Date.now());
//       console.log(path.extname(file.originalname));
//       cb(null, Date.now()+'.webp');
//     },
// });
// const upload = multer({ storage: storage });

// module.exports = upload



const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
	destination: 'public/uploadProductImage/',

	filename: function (req, file, callback) {
		const extension = path.extname(file.originalname)
		const uniqueSuffix = new Date().toISOString().replace(/[-:.]/g, '')
		callback(null, file.fieldname + '-' + uniqueSuffix + '-' + Math.round(Math.random() * 1e9) + extension)
	},
})

const fileFilter = function (req, file, cb) {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true)
	} else {
		cb(null, false);
	}
}
module.exports = multer({ storage, fileFilter })




