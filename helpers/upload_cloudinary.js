const cloudinary = require("../utilities/cloudinary");


// async function uploadToCloudinary(localFilePath) {
//    try {
//     const result = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: 'auto',
//     })
//     return result;
//    } catch (err) {
//     console.error("Cloudinary Upload Error:", err);
//     throw err;
//    }
// };

const uploadToCloudinary = (fileBuffer, folder = "all-images") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;