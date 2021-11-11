import express from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

import Handler from "./handlers.js";
import CommentHandler from "../comments/handelers.js";

const router = express.Router();

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, // CREDENTIALS, this line of code is going to search in your process.env for something called CLOUDINARY_URL
  params: {
    folder: "mongo-strive-blog",
  },
});

router.route("/").get(Handler.getPosts).post(Handler.createPosts);

router
  .route("/:postId")
  .get(Handler.getpostsById)
  .put(Handler.updatePostsById)
  .delete(Handler.deletePostsById);

// upload post Image
router.put(
  "/:postId/uploadImage",
  multer({ storage: cloudinaryStorage }).single("cover"),
  Handler.uploadImage
);

// ******************************* COMMENTS ****************************

router
  .route("/:postId/comments")
  .get(CommentHandler.getComments)
  .post(CommentHandler.createComments);

router
  .route("/:postId/comments/:commentId")
  .get(CommentHandler.getCommentsById)
  .put(CommentHandler.updateCommentsById)
  .delete(CommentHandler.deleteCommentsById);

export default router;
