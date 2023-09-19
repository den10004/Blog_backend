import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    if (!comment)
      return res.json({ message: "комментарий не может быть пустым" });
    const newComment = new Comment({ comment });
    await newComment.save();

    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });
    } catch (error) {
      res.json({ message: "Что-то пошло не так." });
    }
    res.json(newComment);
  } catch (error) {
    res.json({ message: "Что-то пошло не так." });
  }
};

//http://localhost:4444/api/posts/comments/643cf5e9b312f6c08bc74dee
