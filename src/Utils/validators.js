const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidOnlyCharacters = function(value) {
    return /^[A-Za-z]+$/.test(value)
}

module.exports = {isValid, isValidObjectId,isValidOnlyCharacters}