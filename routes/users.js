import express from 'express';
import mongoose from 'mongoose';
import { tokenManage } from '../helper';
import { User } from '../models';
var router = express.Router();
/**
 * - REGISTER
 * - LOGIN
 * - Profile
 * - Edit Profile
 * - GET ALL
 * - REMOVE ALL (private)
 */

router.post('/register', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const profilePic = req.body.profilePic;

  try {
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      res.status(400).json({ message: "This email is already used!"});
    } else {
      const user = new User({
        email,
        password,
        fname,
        lname,
        profilePic,
        height: '-',
        weight: '-',
        gender: '-',
        age: '-',
        smoke: '-',
        medical: '-'
      });
      const result = await user.save();
      const token = tokenManage.generate({email, _id: result._id});
      res.json({ token });
    }
  } catch (err) {
    console.log('Error: ' + err);
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const result = await User.findOne({ email });
    if (!result) {
      res.status(400).json({ message: "User not found!" });
    } else if (result) {
      if (result.password === password) {
        const token = tokenManage.generate({email, _id: result._id});
        res.json({ token });
      } else {
        res.status(400).json({ message: "Password does not match!" });
      }
    }
  } catch (err) {
    console.log('Error: ' + err);
    res.status(400).json(err);
  }
});

router.post('/profile/user', async (req, res, next) => {
  const _id = req.body._id;
  try {
    const user = await User
                        .findOne({ _id })
                        .populate('following')
                        .populate('follower')
                        .populate('pending')
                        .populate('request');
    if (user) {
      user.password = undefined;
      res.json(user);
    } else {
      res.status(400).json({ message: "No user found!"});
    }
  } catch (err) {
    console.log('Error: ' + err);
    res.status(400).json(err);
  }
});

router.post('/profile', async (req, res, next) => {
  const token = req.body.token;
  try {
    const tokenUser = await tokenManage.verify(token);
    const user = await User
                          .findOne({ _id: tokenUser._id })
                          .populate('following')
                          .populate('follower')
                          .populate('pending')
                          .populate('request');
    if(user) {
      user.password = undefined;
      res.json(user);
    } else {
      res.status(400).json({ message: "Token is incorrect"});
    }
  } catch (err) {
    console.log('Error: ' + err);
    res.status(400).json(err);
  }
});

router.put('/profile/edit', async (req, res, next) => {
  const token = req.body.token;
  const profile_key = req.body.profile_key;
  const profile_value = req.body.profile_value;
  
  try {
    const tokenUser = await tokenManage.verify(token);
    const user = await User.update({ _id: tokenUser._id }, {
      $set: {
        [profile_key] : profile_value
      }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(400).json({ message: "Cannot update data" });
    }
  } catch (err) {
    console.log('Error: ' + err);
    res.status(400).json(err);
  }
})

router.post('/', async (req, res, next) => {
  const token = req.body.token;
  try {
    const tokenUser = await tokenManage.verify(token);
    const result = await User
                          .find({ _id: { $ne: tokenUser._id }})
                          .populate('following')
                          .populate('follower')
                          .populate('pending')
                          .populate('request');
    res.json(result);
  } catch (err) {
    console.log('Error: ', err);
    res.status(400).json(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const result = await User.remove({});
    res.json({ message: "Remove Success."});
  } catch (err) {
    console.log('Error: ' + err);
    res.status(400).json(err);
  }
})

export default router;
