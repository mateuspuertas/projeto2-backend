const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (db) => {
  const userModel = new User(db);

  router.get('/login', (req, res) => {
    res.render('login', { error: null });
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const users = await userModel.findAll();
      const user = users.find(u => u.email === email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { error: 'Credenciais inválidas' });
      }
      req.session.user = { name: user.name, email: user.email };
      res.redirect('/posts');
    } catch (error) {
      res.render('error', { message: 'Erro ao fazer login' });
    }
  });

  router.get('/register', (req, res) => {
    res.render('register', { error: null });
  });

  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const users = await userModel.findAll();
      if (users.find(u => u.email === email)) {
        return res.render('register', { error: 'Email já cadastrado' });
      }
      await userModel.create(name, email, password);
      res.redirect('/login');
    } catch (error) {
      res.render('register', { error: 'Erro ao cadastrar usuário' });
    }
  });

  router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
  });

  return router;
};
