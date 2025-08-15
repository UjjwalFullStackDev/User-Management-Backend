const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload/")
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + "-" + file.fieldname+ext)
    }
})


const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed!"), false)
    }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = upload;