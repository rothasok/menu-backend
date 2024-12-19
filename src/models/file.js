const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    key: { type: String },
    mimetype: { type: String, required: true },
    encoding: { type: String, required: true },
    createdDate: { type: Date, required: true, default: new Date() },
    etag: { type: String },
    num: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String },
    role: { type: mongoose.Types.ObjectId, ref: 'Role' },
    slug: { type: String, required: true } // Fixed line
});

const FileModel = mongoose.model('Files', fileSchema)

module.exports = FileModel