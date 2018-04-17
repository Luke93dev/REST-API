const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
        .select('_id name age salary')
        .exec()
        .then(result => {
            const response = {
                NumberOfUsers: result.length,
                Users: result
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age,
        salary: req.body.salary
    });
    user.save().
    then(result => {
            res.status(200).json({
                message: "User created succesfully!",
                createdUser: {
                    name: result.name,
                    age: result.age,
                    salary: result.salary,
                    _id: result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

router.get('/:ID', (req, res, next) => {
    const id = req.params.ID;
    User.findById(id)
        .select('_id name age salary')
        .exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'Nieprawidłowe ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

//Format zapytania dla patch: [{"propName":"name","value":"Jonny black"}]  
router.patch('/:ID', (req, res, next) => {
    const id = req.params.ID;
    const updateProps = {};
    for (let prop of req.body) {
        updateProps[prop.propName] = prop.value;
    }

    User.update({
            _id: id
        }, {
            $set: updateProps
        })
        .exec()
        .then(result => {
            res.status(200).json({
            message: "User updated succesfully!",
            makeRequest: {
                type: 'GET',
                url: 'http://localhost:3000/users/' + id
            }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


router.delete('/:ID', (req, res, next) => {
    const id = req.params.ID;
    User.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
            message: "User deleted succesfully"});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})


module.exports = router;
