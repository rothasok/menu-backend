const express = require('express')
const { handleUpload, getFile, handleUploads, handleS3Upload, getAllFiles, deleteFileS3, deleteFile, updateFileById, getText, updateTextById,getFilebyRoleID,getFilesByQuery } = require('../controller/file')
const { singleUpload, multipleUploads } = require('../middlewares')
const uploadS3 = require('../middlewares/uploadS3')
const fileRouter = express.Router()
fileRouter.get('/', getFilesByQuery)
fileRouter.post('/upload-single', singleUpload, handleUpload)
fileRouter.post('/upload-single-s3', uploadS3, handleS3Upload)
fileRouter.post('/upload-multiple', multipleUploads, handleUploads)
fileRouter.get('/:id', getFile)
fileRouter.get('/text/:id', getText)
fileRouter.delete('/s3/:id', deleteFileS3)
fileRouter.delete('/:id', deleteFile)
fileRouter.get('/', getAllFiles)
fileRouter.get('/getfilesbyrole/:id', getFilebyRoleID)
fileRouter.put('/text/:id', updateTextById)
fileRouter.put('/:id', updateFileById)



module.exports = fileRouter