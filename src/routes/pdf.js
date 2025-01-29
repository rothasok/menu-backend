const express = require('express')
const { handlePdfUpload,getPDFbyUserID } = require('../controller/pdf')
const { singleUpload, multipleUploads } = require('../middlewares')

const pdfRouter = express.Router()

pdfRouter.post('/upload-single', singleUpload, handlePdfUpload)
pdfRouter.get('/:id', getPDFbyUserID)


module.exports = pdfRouter