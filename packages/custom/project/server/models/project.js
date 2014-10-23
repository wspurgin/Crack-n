'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/**
* Project Schema
*/

var projectSchema = new Schema({});

mongoose.model('Project', projectSchema);