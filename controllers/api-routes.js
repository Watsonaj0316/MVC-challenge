const router = require('express').Router(); // import express router 
const { User, Post, Comment } = require('../models'); // import models 

router.post('/post/:id', async (req, res) => {  // add comment to post 
  try {
    const newComment = { // create new comment 
      content: req.body.content, // content from request body 
      creator: req.session.username, // creator from session 
      post_id: req.params.id, // post id from request params 
    }
    await Comment.create(newComment); // create new comment 
    res.redirect(`/post/${req.params.id}`);  // go back to post 
  } catch (err) {
    res.status(500).send(err); // send error status code 
  }
});

router.post('/dashboard', async (req, res) => { // create new post 
  try {
    const newPost = { // create new post 
      title: req.body.title, // title from request body
      content: req.body.content, // content from request body
      creator: req.session.username, // creator from session
    }
    await Post.create(newPost); // create new post
    res.redirect(`/dashboard`); // go back to dashboard
  } catch (err) {
    res.status(500).send(err); // send error status code
  }
});

router.put('/post/:id/edit', async (req, res) => { // update post 
  try {
    await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
          creator: req.session.username,
        },
      }
    );
    res.redirect(`/post/${req.params.id}`); // go back to post we just edited
  } catch (err) {
    res.status(500).json(err); // send error status code
  }
});

router.delete('/post/:id/edit', async (req, res) => { // delete post
  try {
    await Post.destroy({
      where: {
        id: req.params.id,
        creator: req.session.username,
      }
    });
    res.redirect('/dashboard'); // redirect to dashboard
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => { // login handling
  if (req.body.loginuser) { 
    try {
      const dbUserData = await User.findOne({
        where: {
          username: req.body.loginuser,
        }
      });
  
      if (!dbUserData) {
        res
        .status(400).redirect('/login')
        .json('Incorrect username or password. Please try again!');
      return;
      }
  
      const validPassword = await dbUserData.checkPassword(req.body.loginpassword);
  
      if (!validPassword) {
        res
          .status(400).redirect('/login')
          .send('Incorrect username or password. Please try again!');
        return;
      }
  
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.username = dbUserData.username;
        res.redirect('/login');
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.body.signupuser) { 
    const newUser = {
      username: req.body.signupuser,
      password: req.body.signuppassword
    }
    try {
      await User.create(newUser);
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.username = newUser.username;
        res.redirect('/dashboard');
      });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res
        .status(400)
        .send('Username already exists! Please try again.');
      } else if (err.name === 'SequelizeValidationError') {
        res
        .status(400)
        .send('Password must be at least 8 characters long.');
      } else {
        res
          .status(400)
          .send(err);
      }
      return;
    }
  }
});

router.post('/logout', (req, res) => { // logout route 
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
    res.redirect('/login');
  } else {
    res.status(404).end();
  }
});

module.exports = router; // export router
