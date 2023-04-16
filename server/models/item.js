/**
 * Title: item.js
 * Date: April 14, 2023
 * Author: Jamal Eddine Damir
 * Description: This file contains the item Schema
 * Sources:
 * Source code from class GitHub Repository
 * W3Schools.com
 * Stackabuse.com
 * Instructor provided assignment specific instructions
 */

// Require statements
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining item schema
let itemSchema = new Schema({
	text: { type: String },
});

// Exporting schema
module.exports = itemSchema;
