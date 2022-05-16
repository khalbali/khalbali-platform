const express = require("express");
const bcrypt = require("bcrypt");

const isAuthenticated = require("../middleware/isAuthenticated");
require("../passport/passport");
const passport = require("passport");
const db = require("../db/index");
const router = express.Router();
const User = db.user;

//get data of all users

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const rows = await User.findAll();

    const data = rows.map((user) => {
      const values = {
        id: user.id,
        username: user.username,
        updatedAT: user.updatedAt,
        createdAt: user.createdAt,
      };
      return values;
    });

    res.send(data);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

//get user by id

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(404)
        .send({ error: "Could not find user with that id" });
    } else {
      const values = {
        id: user.id,
        username: user.username,
        updatedAT: user.updatedAt,
        createdAt: user.createdAt,
      };
      res.send(values);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

//login using username password

router.post(
  "/login",
  passport.authenticate("local-signup", { failWithError: true }),
  function (req, res, next) {
    return res.json({ message: "Success", user: req.user });
  },
  function (err, req, res, next) {
    return res.json({ message: "Wrong username or password" });
  }
);

//register a new user

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(req.body);

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const selectUserStatement = await User.findOne({
      where: { username: username },
    });

    if (selectUserStatement) {
      return res.status(401).send({ error: "username taken" });
    }
    console.log(password);

    const userPass = await bcrypt.hash(password, 10);
    console.log(userPass);

    const user = await User.create({
      username,
      password: userPass,
    });

    res.send(user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//logout

router.post("/logout", async (req, res) => {
  req.logout();
  res.send({ message: "logged out successfully" });
}) /
  router.put("/:id", async (req, res) => {
    try {
      console.log(req.params.id);
      const { username, password } = req.body;
      if (!username) {
        throw new Error("Username is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      const rows = await User.findOne({ where: { username: username } });

      if (rows != null) {
        return res.status(409).send({ error: "Username is already taken" });
      }

      const hashedpassword = await bcrypt.hash(req.body.password, 10);

      const updateUser = await User.update(
        { username: username, password: hashedpassword },
        { where: { id: req.params.id } }
      );
      if (updateUser) {
        res.send({ message: "username and password updated", username });
      } else {
        throw Error;
      }
    } catch (e) {
      res.status(404).send({ error: e.message });
    }
  });

//delete user using id

router.delete("/:id", async (req, res) => {
  try {
    const deleteUserStatement = await User.destroy({
      where: { id: req.params.id },
    });

    if (!deleteUserStatement) {
      return res
        .status(404)
        .send({ error: "Could not find user with that id" });
    }
    return res.send({
      message: "deleted",
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
