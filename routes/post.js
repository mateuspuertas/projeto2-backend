const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

module.exports = (db) => {
  const postModel = new Post(db);

  router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
      const posts = await postModel.findAll();
      res.render('posts', { posts, user: req.session.user });
    } catch (error) {
      res.render('error', { message: 'Erro ao carregar posts' });
    }
  });

  router.post('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { title, content } = req.body;
    try {
      await postModel.create(title, content, req.session.user.name);
      res.redirect('/posts');
    } catch (error) {
      res.render('error', { message: 'Erro ao publicar post' });
    }
  });

  return router;
};
