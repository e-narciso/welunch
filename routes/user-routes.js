const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/signup", (req, res, next) => {
  res.render("user-views/signup");
});

router.post("/signup", (req, res, next) => {
  // let adminPrivilege = false;

  // if (req.user) {
  //   // check if someone is logged in
  //   if (req.user.isAdmin) {
  //     adminPrivilege = req.body.role ? req.body.role : false;
  //   }
  // }

  const username = req.body.theUsername;
  const password = req.body.thePassword;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.create({
    username: username,
    password: hash,
  })
    .then(() => {
      res.redirect("/login");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("user-views/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/dashboard", (req, res, next) => {
  res.render("user-views/dashboard");
})

router.post("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/profile", (req, res, next) => {
  if (req.user) {
    res.render("user-views/profile", { user: req.user });
  } else {
    res.redirect("/");
  }
});

router.get("/account", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "Please login to your account");
    res.redirect("/login");
  }
  res.render("user-views/account-settings");
});

router.post("/account/google-update", (req, res, next) => {
    User.findByIdAndUpdate(req.user.id, {
      username: req.body.theUsername
    })
      .then(data => {
        req.flash("success", "Your settings have been saved");
        res.redirect("/account");
      })
      .catch(err => next(err));
  }
)

router.post("/account/update", (req, res, next) => {

  let id = req.user.id;
  let oldPass = req.body.theOldPassword;
  let newPass = req.body.theNewPassword;

  if (!bcrypt.compareSync(oldPass, req.user.password)) {
    req.flash("error", "Passwords do not match");
    res.redirect("/account-settings");
  }

  const salt = bcrypt.genSaltSync(10);
  let hash;
  if (newPass) {
    hash = new Promise((resolve, reject) => {
      resolve(bcrypt.hashSync(newPass, salt));
    });
  } else {
    hash = new Promise((resolve, reject) => {
      resolve(bcrypt.hashSync(oldPass, salt));
    });
  }

  hash
    .then(theActualPassword => {
      User.findByIdAndUpdate(id, {
        username: req.body.theUsername,
        password: theActualPassword,
        profileImage: req.body.theImage
      })
        .then(result => {
          req.flash("success", "Your settings have been saved");
          res.redirect("/profile");
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/delete", (req, res, next) => {
  User.findByIdAndRemove(req.user._id)
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/add-new", (req, res, next) => {
  res.redirect("user-views/new");
})

// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.profile",
//       "https://www.googleapis.com/auth/userinfo.email"
//     ]
//   })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/",
//     failureRedirect: "/" // here you would redirect to the login page using traditional login approach
//   })
// );

module.exports = router;
