const express = require("express");
const db = require("../db/index");

const isAuthenticated = require("../middleware/isAuthenticated");
const Subreddit = db.subreddit;
const Post = db.post;
const PostVote = db.vote;
const comments = db.comment;
const router = express.Router();
const User = db.user;
const Sequelize = require("sequelize");
const checkModerator = require("../helperFunctions/checkModerator");

//get all post or of a specific subreddit

router.get("/", async (req, res) => {
  try {
    const { subreddit } = req.query;
    let whereClause = {};

    if (subreddit) {
      whereClause = { where: { name: subreddit } };
      console.log(subreddit);
    }

    const FoundData = await Subreddit.findAll(whereClause);
    if (!FoundData) {
      return res.status(404).send("no subreddit avaible with this name");
    } else {
      const FoundPost = await Post.findAll({
        where: { subredditId: FoundData[0].id },
        attributes: {
          include: [
            [
              Sequelize.fn("COUNT", Sequelize.col("comments.id")),
              "PostComments",
            ],
            [
              Sequelize.fn("SUM", Sequelize.col("votes.vote_value")),
              "postVotes",
            ],
          ],
        },
        include: [
          { model: User, attributes: ["username"] },
          { model: Subreddit, attributes: ["name"] },
          { model: comments, attributes: [] },
          { model: PostVote, attributes: [] },
        ],
        group: ["comments.postId"],
        group: ["votes.postId"],
      });

      if (FoundPost.length == 0) {
        return res.status(404).send("no post avaible with this name");
      } else {
        return res.status(200).send(FoundPost);
      }
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

//get post data using id

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const { userId } = req.body;

    const foundPost = await Post.findOne({
      where: { id: id },
    });

    if (!foundPost) {
      return res
        .status(404)
        .send({ error: "Could not find post with that id" });
    } else {
      res.send(foundPost);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

//make a post in a subreddit

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, title, body, subreddit } = req.body;
    if (!type) {
      throw new Error("Must specify post type");
    }
    if (!title) {
      throw new Error("Must specify post title");
    }
    if (type === "link" && !body) {
      throw new Error("Must specify link post URL");
    }
    if (!subreddit) {
      throw new Error("Must specify subreddit");
    }

    const foundSubreddit = await Subreddit.findOne({
      where: { name: subreddit },
    });

    if (!foundSubreddit) {
      throw new Error("Subreddit does not exist");
    }

    const newpost = await Post.create({
      type,
      title,
      body,
      userId,
      subredditId: foundSubreddit.id,
    });

    const newPostVote = await PostVote.create({
      vote_value: 1,
      postId: newpost.id,
      userId,
    });

    res.status(201).send(newpost);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//edit a post

router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [{ model: Subreddit, attributes: ["name"] }],
    });

    if (!post) {
      return res
        .status(404)
        .send({ error: "Could not find post with that id" });
    }
    if (
      post.userId !== req.body.userId &&
      (await checkModerator(post.userId, post.subreddit.name)) === false
    ) {
      return res
        .status(403)
        .send({ error: "You must the comment author to edit it" });
    }

    const updatedPost = await post.update(req.body);

    return res.send(updatedPost);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//delete a post

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [{ model: Subreddit, attributes: ["name"] }],
    });

    if (!post) {
      return res
        .status(404)
        .send({ error: "Could not find post with that id" });
    }
    if (
      post.userId !== req.body.userId &&
      (await checkModerator(post.userId, post.subreddit.name)) === false
    ) {
      return res
        .status(403)
        .send({ error: "You must the comment author to edit it" });
    }

    await Post.destroy({ where: { id: id } });

    return res.send({ message: "deleted" });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
