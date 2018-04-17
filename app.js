const express = require('express');
const app = express();

//Wypisywanie logów w konsoli
const morgan = require('morgan');
const mongoose = require('mongoose');

const usersRoutes = require('./api/routes/users');

mongoose.connect('mongodb://Lukasz93:programista93@cluster0-shard-00-00-hwiil.mongodb.net:27017,cluster0-shard-00-01-hwiil.mongodb.net:27017,cluster0-shard-00-02-hwiil.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

app.use(morgan('dev'));

//Kodowanie do formatu JSON
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Obsługa CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PATCH', 'POST', 'GET', 'DELETE');
    return res.status(200).json({});
}
    next();
});


app.use('/users', usersRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})



module.exports = app;