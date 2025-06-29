const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'microblogging';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'segredo_super_secreto',
  resave: false,
  saveUninitialized: true
}));

MongoClient.connect(url)
  .then(client => {
    const db = client.db(dbName);
    const authRoutes = require('./routes/auth')(db);
    const postRoutes = require('./routes/post')(db);

    app.use('/', authRoutes);
    app.use('/posts', postRoutes);

    app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB', err);
  });
