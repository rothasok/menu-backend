const mongoose = require('mongoose')

const pdfSchema = new mongoose.Schema({
    originalname: { type: String, required: true },
    path: { type: String, required: true },
    userid: { type: mongoose.Types.ObjectId, ref: 'Owner' },
});
const PDFModel = mongoose.model('Pdfs', pdfSchema)
module.exports = PDFModel