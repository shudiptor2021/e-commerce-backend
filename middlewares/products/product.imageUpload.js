// external inports
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

// internal imports
const uploadToCloudinary = require("../../helpers/upload_cloudinary");
const uploader = require("../../utilities/product.singleUploader");

function imageUpload(req, res, next) {
  const upload = uploader(
    "all-images",
    ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    2000000,
    "Only .jpg, .jpeg, .png, .webp formats are allowed and size must be under 2MB",
  );

  //   call the middleware function

  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    } else {
      try {
        // console.log("Files received:", req.files);
        const thumbnail = req.files?.["thumbnail"]?.[0];
        const images = req.files?.["images"] || [];

        // ---------------
        //       if (thumbnail) {
        //   console.log("Thumbnail path exists?", fs.existsSync(thumbnail.path), thumbnail.path);
        // }

        // for (const img of images) {
        //   console.log("Image path exists?", fs.existsSync(img.path), img.path);
        // }
        // ----------------

        if (thumbnail || images.length) {
          // Upload all to Cloudinary
          if (thumbnail) {
            const result = await uploadToCloudinary(thumbnail.path);
            req.body.thumbnail = {
              url: result.secure_url,
              public_id: result.public_id,
            };

            // Delete the local file after upload
            if (result) {
              await unlinkFile(thumbnail.path);
            }
          }

          if (images.length) {
            const uploadPromises = images.map((img) =>
              uploadToCloudinary(img.path),
            );
            const results = await Promise.all(uploadPromises);
            req.body.images = results.map((res) => ({
              url: res.secure_url,
              public_id: res.public_id,
            }));

            if (results) {
              const deletePromises = images.map((img) => unlinkFile(img.path));
              await Promise.all(deletePromises);
            }
          }
        } else {
          // No file upload, possibly json body
          if (typeof req.body.thumbnail === "string") {
            req.body.thumbnail = { url: req.body.thumbnail };
          }

          // If JSON includes image URLs array
          if (Array.isArray(req.body.images)) {
            req.body.images = req.body.images.map((url) => ({ url }));
          } else if (!req.body.images) {
            // Default empty array if not provided
            req.body.images = [];
          }
        }

        next();
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  });
}

module.exports = imageUpload;
