
const itemModel = require("../Models/itemModel")
const validator = require("../Utils/validators")


    
    const createItem = async function (req, res) {
        try {
            let data = req.body

            if (Object.keys(data).length == 0) {
                return res.status(400).send({
                    status: false,
                    msg: "request body can't be empty, BAD REQUEST"
                })
            }
    
            let { name, sku, hsn, rate, discount , description} = data
    
            if (!validator.isValid(name)) {
                return res.status(400).send({
                    status: false,
                    msg: "name is required"
                })
            }
    
            if (!validator.isValid(sku)) {
                return res.status(400).send({
                    status: false,
                    msg: "sku is required"
                })
            }
    
            if (!validator.isValid(hsn)) {
                return res.status(400).send({
                    status: false,
                    msg: "hsn is required"
                })
            }

            if (!validator.isValid(rate)) {
                return res.status(400).send({
                    status: false,
                    msg: "rate is required"
                })
            }

            if (!validator.isValid(description)) {
                return res.status(400).send({
                    status: false,
                    msg: "rate is required"
                })
            }
    
            let isnameAlreadyUsed = await itemModel.findOne({ name })
            if (isnameAlreadyUsed) {
                return res.status(400).send({
                    status: false,
                    msg: `this ${name} already exist please enter another name`
                })
            }

            let isSkuAlreadyUsed = await itemModel.findOne({ sku })
            if (isSkuAlreadyUsed) {
                return res.status(400).send({
                    status: false,
                    msg: `this ${sku} already exist please enter another sku`
                })
            }

            let isHsnAlreadyUsed = await itemModel.findOne({ hsn })
            if (isHsnAlreadyUsed) {
                return res.status(400).send({
                    status: false,
                    msg: `this ${hsn} already exist please enter another hsn`
                })
            }
    
            
            let dataToBeCreated = { name, sku, hsn, rate, discount , description}
            let itemData = await itemModel.create(dataToBeCreated)
            return res.status(201).send({
                status: true,
                msg: "item created successfully",
                data: itemData
            })
    
        }
        catch (error) {
            console.log(error)
            return res.send({ msg: error.message })
        }
    }

    const getItem = async function (req, res) {
        try {
            let getAllItem = await itemModel.find()
            res.send(getAllItem)
        } catch (error) {
            console.log(error)
            res.status(500).send({
                msg: error.message
            })
        }
    }
    
module.exports = { createItem, getItem}