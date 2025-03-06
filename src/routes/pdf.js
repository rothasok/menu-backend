const express = require('express')
const { handlePdfUpload,
    handleGetQR,
    handleImageUpload,
    getPDFbyUserID,
    getPDFBase64byUserID,
    getQrBase64ByUserID,
    deletePDFByUserID } = require('../controller/pdf')
const { singleUpload, multipleUploads } = require('../middlewares')

const pdfRouter = express.Router()
pdfRouter.get('/qrcode/:id', handleGetQR)
pdfRouter.post('/upload-single', singleUpload, handlePdfUpload)
pdfRouter.post('/upload-image', singleUpload, handleImageUpload)// mobile using
pdfRouter.get('/qr/:id', singleUpload, getQrBase64ByUserID)

pdfRouter.get('/base64/:id', getQrBase64ByUserID)
pdfRouter.get('/pdfbase64/:id', getPDFBase64byUserID)
pdfRouter.delete('/:userid', deletePDFByUserID)
pdfRouter.get('/:id', getPDFbyUserID)




module.exports = pdfRouter