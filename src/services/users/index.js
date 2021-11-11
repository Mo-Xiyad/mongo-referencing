import express from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

import Handler from "./handlers.js";

const router = express.Router();

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, // CREDENTIALS, this line of code is going to search in your process.env for something called CLOUDINARY_URL
  params: {
    folder: "mongo-strive-blog",
  },
});

router.route("/").get(Handler.getUsers).post(Handler.createUsers);

router
  .route("/:userId")
  .get(Handler.getUsersById)
  .put(Handler.updateUsersById)
  .delete(Handler.deleteUsersById);

// upload post Image
/* 
router.put(
  "/:postId/uploadImage",
  multer({ storage: cloudinaryStorage }).single("cover"),
  Handler.uploadImage
); */

export default router;
