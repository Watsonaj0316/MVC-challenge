const router = require('express').Router();
const { Post, Comment } = require('../models');

router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: Comment,
        },
      ],
    });
    const posts = dbPostData.map((post) => {
      const userPost = post.get({ plain: true });
      userPost.commentCount = userPost.comments.length;
      return userPost;
    });
    posts.reverse();
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/dashboard', async (req, res) => {
  if (!req.session.loggedIn) {
    res.render('dashboard');
    return;
  }
  try {
    const dbUserPostData = await Post.findAll({
      where: {
        creator: req.session.username,
      },
      include: [
        {
          model: Comment,
        }
      ]
    });
    const posts = dbUserPostData.map((post) => {
      const userPost = post.get({ plain: true });
      userPost.commentCount = userPost.comments.length;
      return userPost;
    });
    posts.reverse();
    res.render('dashboard', {
      posts,
      username: req.session.username,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
        }
      ]
    });
    const post = dbPostData.get({ plain: true });
    res.render('post', {
      post,
      username: req.session.username,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id/edit', async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.id);
    const post = dbPostData.get({ plain: true });
    if (post.creator !== req.session.username) {
      res.redirect('/');
    }
    res.render('update-post', {
      post,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

module.exports = router;
