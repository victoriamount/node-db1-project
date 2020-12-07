const express = require("express");
const server = express();
const AccountsRouter = require('./accounts/accounts-router')

server.use(express.json());
server.use('/api/accounts', AccountsRouter)

server.get('/', (req, res) => {
    res.status(200).json('API is up')
})

module.exports = server;
