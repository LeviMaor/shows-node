if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
};

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const actorRouter = require('./routes/actors');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL,
   { useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'));

app.use('/', indexRouter);
app.use('/actors', actorRouter);

app.listen(process.env.PORT || 3000);

// pXjPRrbu85Ay7In6


//mongodb+srv://user:<password>@cluster0.g9ww6ei.mongodb.net/?retryWrites=true&w=majority


// mongodb+srv://user:pXjPRrbu85Ay7In6@cluster0.g9ww6ei.mongodb.net/?retryWrites=true&w=majority