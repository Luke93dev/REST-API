require('dotenv').load();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const todosRoutes = require('./api/routes/todos');
const userRoutes = require('./api/routes/user');

mongoose.connect(`mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_USER_PASSWORD}@cluster0-shard-00-00-hwiil.mongodb.net:27017,cluster0-shard-00-01-hwiil.mongodb.net:27017,cluster0-shard-00-02-hwiil.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));

//Kodowanie do formatu JSON
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PATCH', 'POST', 'GET', 'DELETE');
    return res.status(200).json({});
}
    next();
});


app.use('/todos', todosRoutes);
app.use("/user", userRoutes);

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