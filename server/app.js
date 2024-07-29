var cors = require('cors');
require('dotenv').config();
require('./db/mongoose');

/** Express */
const express = require('express');
const bodyParser = require('body-parser');

const swaggerjsdoc = require('swagger-jsdoc')
const swaggerui = require('swagger-ui-express')

const app = express();
const server = require('http').Server(app);

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

const middleware = require('./middleware/verifyToken');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const options = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        url: process.env.SERVER_URL
      }
    ],
    info: {
      title: 'task manager',
      version: '1.0.0',
    },
  },
  apis: ['./docs/apiDocs.js'],
};

const spacs = swaggerjsdoc(options);

app.use('/api-docs', swaggerui.serve, swaggerui.setup(spacs));

const corsOpts = {
  origin: ["*"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOpts));

/* Unprotected routes */
app.get('/status', (req, res) => {
  res.status(200).send({ status: 'OK' });
});
// app.use(
app.use('/api/auth', authRoutes);
/* Protected routes */
app.use(middleware.verifyToken); // Apply middleware to all routes defined after this line
app.use('/api/task', taskRoutes);


if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT || 8080, () => {
    console.info(`[LOG=SERVER] Server started on port ${process.env.PORT || 8080}`);
  });
}

module.exports = { app };
