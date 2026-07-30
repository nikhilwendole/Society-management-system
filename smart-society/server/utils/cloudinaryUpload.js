const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

// Wraps Cloudinary's upload_stream in a Promise so controllers can use async/await
const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) return resolve(result);
        const uploadError = error instanceof Error ? error : new Error(error?.message || String(error) || "Cloudinary upload failed");
        reject(uploadError);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };
