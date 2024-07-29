const { task } = require('../models/task');
const mongoose = require('mongoose');

const { user } = require('../models/user')


const addNewTask = async (userId, body, files) => {
    try {
        if (body.status == "completed" || body.status == "Completed") {
            body.completion_date = new Date()
        }
        const taskBody = {
            project: body.project,
            task_name: body.task_name,
            task_details: body.task_details,
            status: body.status,
            due_date: new Date(body.due_date),
            created_by: userId,
            created_on: body.created_on
        }

        const data = await task(taskBody).save();

        return true;
    }
    catch (error) {
        throw new Error(error.message || error)
    }
}

const getAllTask = async (userId, project) => {
    try {

        const finalData = await task.find({ project: project, created_by: userId }).lean();
        return finalData

    }
    catch (error) {
        throw new Error(error.message || error)
    }
}

const deleteTask = async (taskId) => {
    try {

        const finalData = await task.deleteOne({ _id: mongoose.Types.ObjectId(taskId) }).lean();
        return finalData

    }
    catch (error) {
        throw new Error(error.message || error)
    }
}

const updateNewTask = async (body) => {
    try {
        let taskId = body._id;
        delete body._id;
        const _ = await task.updateOne({ _id: mongoose.Types.ObjectId(taskId) }, body);

        return true
    }
    catch (error) {
        throw new Error(error.message || error)
    }
}

const getTask = async (createdOn, userId) => {
    try {
        const data = await task.find({  created_on: createdOn, created_by: userId }).lean();
        return data
    }
    catch (error) {
        throw new Error(error.message || error)
    }
}

module.exports = { addNewTask, updateNewTask, getTask, getAllTask, deleteTask }
