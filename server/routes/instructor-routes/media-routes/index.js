const express = require("express");
const multer = require("multer");

const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../../helpers/cloudinary");

const router = express.Router();

const upload = multer({ dest: "/uploads" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    console.log("File uploaded successfully via upload media route");
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully via upload media route",
      result,
    });
  } catch (error) {
    console.log("Error uploading via media route", error);
    return res
      .status(500)
      .json({ sucess: false, message: "Error uploading via media route" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      console.log("Asset id required for deletion");
      return res
        .status(400)
        .json({ message: "Asset id required for deletion" });
    }

    await deleteMediaFromCloudinary(id);

    console.log("File deleted via media route");

    return res.status(200).json({
      success: true,
      message: "File deleted via media route",
    });
  } catch (error) {
    console.log("Error deleting via media route", error);
    return res
      .status(500)
      .json({ sucess: false, message: "Error deleting via media route" });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    console.log("Bulk upload successful");

    return res.status(200).json({
      success: true,
      message: "Bulk upload successful",
      result: results,
    });
  } catch (error) {
    console.log("Error bulk uploading files", error);
    return res
      .status(500)
      .json({ sucess: false, message: "Error bulk uploading files" });
  }
});

module.exports = router;