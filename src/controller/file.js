const asyncHandler = require("express-async-handler");
const FileModel = require("../models/file");
const path = require('path')
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')

const s3Clinet = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

const getAllFiles = asyncHandler(async (req, res) => {
    const files = await FileModel.find()
    return res.json(files)
})

const handleUpload = asyncHandler(async (req, res) => {
    const file = new FileModel(req.file)
    file.save()
    return res.json(file)
})

const handleUploads = asyncHandler(async (req, res) => {
    // const file = new FileModel(req.file)
    // file.save()
    const files = req.files
    return res.json(files)
})

const handleS3Upload = asyncHandler(async (req, res) => {
    const { location, originalname, ...self } = req.file
    const file = new FileModel({
        path: location,
        filename: originalname,
        originalname: originalname,
        ...self
    })
    file.save()
    return res.json(file)
})


const getFile = asyncHandler(async (req, res) => {
    const id = req.params.id
    const file = await FileModel.findById(id)
    return res.sendFile(path.join(__dirname, "./../../" + file.path))
})

const deleteFileS3 = asyncHandler(async (req, res) => {
    const id = req.params.id
    const file = await FileModel.findById(id)
    const input = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.key,
    };
    // Delete in S3
    const command = new DeleteObjectCommand(input)
    const response = await s3Clinet.send(command)
    // Delete in Mongo
    const result = await FileModel.deleteOne({ _id: id })
    return res.json({ response, result })
})

const deleteFile = asyncHandler(async (req, res) => {
    const id = req.params.id
    const file = await FileModel.findById(id)
    fs.unlinkSync(path.join(__dirname, "./../../" + file.path))
    const result = await FileModel.deleteOne({ _id: id })
    return res.json(result)
    // return res.json(result)
})

module.exports = { handleUpload, getFile, handleUploads, handleS3Upload, deleteFileS3, getAllFiles, deleteFile }