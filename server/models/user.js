const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        email: {
            type: String
        },
        secret_code: {
            type: String
        }
    },
    {
        timestamps: {
            created_at: 'created_at',
            updated_at: 'updated_at'
        }
    }
);


const user = mongoose.model('user', userSchema);

module.exports = { user };
