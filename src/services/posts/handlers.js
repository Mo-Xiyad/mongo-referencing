import PostModel from "../../models/postShema.js";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
/*
q2m translates something like /books?limit=5&sort=-price&offset=15&price<10&category=fantasy into something that could be directly usable by mongo like
{
  criteria: { price: { '$lt': 10 }, category: 'fantasy' },
  options: { sort: { price: -1 }, skip: 15, limit: 5 }
}
*/
const getPosts = async (req, res, next) => {
  try {
    // {{local}}/posts?limit=2&offset=2 URL
    const mongoQuery = q2m(req.query);
    // console.log(mongoQuery);
    const totalPosts = await PostModel.countDocuments(mongoQuery.criteria);
    const post = await PostModel.find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort);
    if (post) {
      res.send({
        links: mongoQuery.links("/posts", totalPosts),
        pageTotal: Math.ceil(totalPosts / mongoQuery.options.limit),
        totalPosts,
        post: post,
      });
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
    // const allPosts = await PostModel.find(
    // {},
    // { createdAt: 0, updatedAt: 0, __v: 0 }
    // );
    // const count = await PostModel.countDocuments();

    // skip = (page number - 1) * limit
    // res.status(200).send({ count: count, posts: allPosts });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createPosts = async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body); // here happens validation of req.body, if it is not ok Mongoose will throw a "ValidationError" (btw user is still not saved in db yet)
    const { _id } = await newPost.save(); // this is the line in which the interaction with the db happens

    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getpostsById = async (req, res, next) => {
  try {
    const id = req.params.postId;
    const post = await PostModel.findById(id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404, `Post with id ${id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updatePostsById = async (req, res, next) => {
  try {
    const id = req.params.postId;
    const updatePost = await PostModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatePost) {
      res.send(updatePost);
    } else {
      next(createHttpError(404, `Post with id ${id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deletePostsById = async (req, res, next) => {
  try {
    const id = req.params.postId;
    const deletePost = await PostModel.findByIdAndDelete(id);
    if (deletePost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// upload image
const uploadImage = async (req, res, next) => {
  try {
    const imgUrl = req.file.path;
    console.log(req.file);
    const id = req.params.postId;
    const updatePost = await PostModel.findByIdAndUpdate(
      id,
      { $set: { cover: imgUrl } },
      {
        new: true,
      }
    );
    res.send(updatePost);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const postsHandler = {
  getPosts,
  createPosts,
  getpostsById,
  updatePostsById,
  deletePostsById,
  uploadImage,
};
export default postsHandler;
