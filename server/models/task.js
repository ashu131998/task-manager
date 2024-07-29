const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        project: {
            type: Object
        },
        task_name: {
            type: String,
            unique: true
        },
        task_details: {
            type: String
        },
        due_date: {
            type: Date
        },
        created_by: {
            type: String
        },
        created_on: {
            type: String
        },
        status: {
            type: Object
        }
    }
);


const task = mongoose.model('task', taskSchema);

module.exports = { task };
