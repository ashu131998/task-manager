const express = require('express');
const controller = require('../controller/task')
const router = express.Router();

//middleware.taskAPIsAccess

// middleware.taskAPIsAccess
router.post('/get', async (req, res) => {
    try {

        const userId = req.userId;
        const projectId = req.body.project;

        const data = await controller.getAllTask(userId, projectId);

        return res.status(200).send({ status: true, data: data });
    }
    catch (error) {
        return res.status(400).send({ status: false, message: error.message || error });
    }
})

router.post('/delete', async (req, res) => {
    try {

        const taskId = req.body.task_id;

        const response = await controller.deleteTask(taskId);

        return res.status(200).send({ status: true});
    }
    catch (error) {
        return res.status(400).send({ status: false, message: error.message || error });
    }
})

router.post('/', async (req, res) => {
    try {

        const userId = req.userId;

        if (!req.body) {
            return res.status(400).send({ status: false, message: 'invalid request body' });
        }
        const data = await controller.addNewTask(userId, req.body);

        return res.status(200).send({ status: true, message: 'successfully created the task' });
    }
    catch (error) {
        return res.status(400).send({ status: false, message: error.message || error });
    }
})

router.post('/by_date', async (req, res) => {
    try {
        const created_on = req.body.created_on;
        if (!created_on) {
            return res.status(400).send({ status: false, message: 'invalid request body' });
        }
        const data = await controller.getTask(created_on, req.userId);

        return res.status(200).send({ status: true, data: data });
    }
    catch (error) {
        return res.status(400).send({ status: false, message: error.message || error });
    }
})


router.post('/update', async(req, res) => {
    try {
        if(!req.body._id) {
            return res.status(400).send({ status: false, message: 'invalid request body'});
        }
        const data = await controller.updateNewTask(req.body);

        return res.status(200).send({ status: true, message: 'successfully updated the task'});
    }

    catch ( error) {
        return res.status(400).send({ status: false, message: error.message || error});
    }
})

module.exports = router;