const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Todo = require('../models/todo');
const checkAuth = require('../middleware/auth');

router.get("/", (req, res, next) => {
    Todo.find()
      .select("title _id text")
      .exec()
      .then(todos => {
        const response = {
          count: todos.length,
          todos: todos.map(todo => {
            return {
              title: todo.title,
              text: todo.text,
              _id: todo._id
            };
          })
        };
        //   if (docs.length >= 0) {
        res.status(200).json(response);
      })
      .catch(err => {
          console.log(err)
        res.status(500).json({
          error: err
        });
      });
  });

  router.post("/", checkAuth, (req, res, next) => {
    const todo = new Todo({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      text: req.body.text,
    });
    todo
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created todo successfully",
          createdTodo: {
              title: result.title,
              text: result.text,
              _id: result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  router.delete("/:todoId", checkAuth, (req, res, next) => {
    const id = req.params.todoId;
    Todo.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Todo deleted',
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;
