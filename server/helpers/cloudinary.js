const cloudinary = require("cloudinary").v2;

//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log("Asset uploaded to cloudinary");
    return res;
  } catch (error) {
    console.log("Error uploading to cloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("Asset deleted from cloudinary");
  } catch (error) {
    console.log("Failed to delete asset from cloudinary", error);
    throw new Error("Failed to delete asset from cloudinary");
  }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };
