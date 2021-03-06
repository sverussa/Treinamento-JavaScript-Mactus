const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/UsersController');
const TasksController = require('../controllers/TasksController');

router.post('/login', UsersController.login);

router.post('/', UsersController.createUser);
router.put('/:userId', UsersController.updateUser);
router.get('/:userId', UsersController.returnUserById);
router.delete('/:userId', UsersController.deleteUser);
router.get('/', UsersController.returnUser);
router.options('/count', UsersController.countUsers);

router.post('/:userId/task', TasksController.createTask);

module.exports = {
    router: router,
    path: '/users'
};
