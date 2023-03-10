require('dotenv').config();
const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
users.use(cors());

// ----- Register Route ----

users.post('/register', (req, res) => {
  const today = new Date();
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today,
  };

  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then((user) => {
              res.json({ status: 'Registered!' });
            })
            .catch((err) => {
              res.send('error: ' + err);
            });
        });
      } else {
        res.json({ error: 'User already exists' });
      }
    })
    .catch((err) => {
      res.send('error: ' + err);
    });
});

// ---- Login Route ---

users.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          };
          let token = jwt.sign(payload, manishbaba, {
            expiresIn: 1440,
          });
          res.send(token);
        } else {
          res.json({ error: 'Password Mismatch' });
        }
      } else {
        res.json({ error: 'User not found!' });
      }
    })
    .catch((err) => {
      res.send('error: ' + err);
    });
});

// ---- Profile Route ---

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(
    req.headers['authorization'],
    process.env.SECRET_KEY
  );

  User.findOne({
    _id: decoded._id,
  })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.send('User not found!');
      }
    })
    .catch((err) => {
      res.send('error: ' + err);
    });
});

module.exports = users;
