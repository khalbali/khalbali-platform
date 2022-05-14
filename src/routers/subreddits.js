const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const db = require("../db/index");
const Subreddit = db.subreddit;
const Moderator = db.moderator;
const router = express.Router();

//get names of all subreddit

router.get("/", async (req, res) => {
  try {
    console.log(req.user.id);
    const allSubreddits = await Subreddit.findAll();
    res.send(allSubreddits);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

//get subreddit data using name

router.get("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const subredditData = await Subreddit.findOne({ where: { name: name } });
    if (!subredditData) {
      res
        .status(404)
        .send({ error: "Could not find subreddit with that name" });
    }
    res.send(subredditData);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

//make a subreddit

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    console.log(req.body);
    const nameRegex = new RegExp("^[a-z0-9]+$", "i");

    if (!nameRegex.test(name)) {
      throw new Error(
        "Subreddit name must consist only of alphanumeric characters, and must have length at least 1"
      );
    }

    const newSubreddit = await Subreddit.create({
      name,
      description,
    });

    newSubreddit.save();

    const newModerator = await Moderator.create({
      userId,
      subredditId: newSubreddit.id,
    });

    res.send(newSubreddit);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
