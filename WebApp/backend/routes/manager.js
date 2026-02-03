const express = require("express");
const Routes = express.Router()

const V1_Manager = require("./v1/manager");

Routes.use('/v1', V1_Manager)

module.exports = Routes
