const multer = require("multer");
const path = require("path");
const fs = require("fs");

// for file store
// function uploader(
//   // subfolder_path,
//   allowed_file_types,
//   max_file_size,
//   error_msg
// ) {
//   // file upload folders
//   const UPLOAD_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}`;

//   // ✅ Ensure directory exists
//   fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });

//   // difine storage
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, UPLOAD_FOLDER);
//     },
//     filename: (req, file, cb) => {
//       const fileExt = path.extname(file.originalname);
//       const fileName = file.originalname
//         .replace(fileExt, "")
//         .toLowerCase()
//         .split(" ")
//         .join("-");
//       cb(null, fileName + fileExt);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     // If no file is provided (field empty), just continue
//     if (!file || !file.mimetype) {
//       return cb(null, true);
//     }
//     // If file exists, validate MIME type
//     if (allowed_file_types.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error(error_msg));
//     }
//   };

//   // prepare the final multer upload
//   const upload = multer({
//     storage: storage,
//     limits: { fileSize: max_file_size },
//     fileFilter: fileFilter,
//   });

//   return upload;
// }

// for memory store

function uploader(
  subfolder_path, // no longer needed but kept for compatibility
  allowed_file_types,
  max_file_size,
  error_msg
) {
  const storage = multer.memoryStorage(); // ✅ IMPORTANT

  const fileFilter = (req, file, cb) => {
    if (!file || !file.mimetype) {
      return cb(null, true);
    }

    if (allowed_file_types.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(error_msg));
    }
  };

  return multer({
    storage,
    limits: { fileSize: max_file_size },
    fileFilter,
  });
}

module.exports = uploader;
