const asyncHandler = require("express-async-handler");
const FileModel = require("../models/file");
const path = require('path')
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs');
const RoleModel = require("../models/role");
const permissionsModel = require("../models/permissions");

const s3Clinet = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

const getAllFiles = asyncHandler(async (req, res) => {
    const type = req.query
    const files = await FileModel.find(type)
    return res.json(files)
})


// const getFilebyPermissionID = asyncHandler(async (req, res) => {
//     const perId = req.params.id;
    
//     try {
//         const per = await permissionsModel.findById(perId);
//         if (!per) {
//             return res.status(404).json({ message: "permission not found" });
//         }

//         const type = req.query;
//         // Include the roleId in the query conditions
//         const query = { ...type, permissionid: perId };

//         const files = await FileModel.find(query);
//         return res.json(files);
//     } catch (error) {
//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// });


const getFilebyRoleID = asyncHandler(async (req, res) => {
    const roleId = req.params.id;
    
    try {
        const role = await RoleModel.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        const type = req.query;
        // Include the roleId in the query conditions
        const query = { ...type, role: roleId };

        const files = await FileModel.find(query);
        return res.json(files);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


const getFilesByQuery = asyncHandler(async (req, res) => {
    try {
        // Get query parameters directly from req.query
        const { type, slug } = req.query;

              const query = { type: type, slug: slug };
      const files = await FileModel.find(query);

        // Respond with the list of files
        if (files.length === 0) {
            return res.status(404).json({ message: "No files found for the given criteria." });
        }

        return res.json(files);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});



const handleUpload = asyncHandler(async (req, res) => {

    //const userId = claimTokenData(req)['id'];
    console.log(req.body)
    //const text = req.body.text;
    const num = req.body.num
    const title = req.body.title
    const role = req.body.role
    const type = req.body.type
    const slug = req.body.slug
    const { ...self } = req.file
    const file = new FileModel({
        role: role,
        type: type,
        num: num,
        title: title,
        slug: slug,
        ...self
    })
    console.log(role);
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
const getText = asyncHandler(async (req, res) => {
    const id = req.params.id
    const file = await FileModel.findById(id)
    return res.json(file)
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
const updateFileById = asyncHandler(async (req, res) => {
    
    const id = req.params.id

    const file = req.file
    console.log(req.file)

    const result = await FileModel.updateOne({ _id: id }, file)

    // const result = await CourseModel.findByIdAndUpdate(id, req.body)
    console.log(result)
    return res.json(result)
})
const updateTextById = asyncHandler(async (req, res) => {
    
    const id = req.params.id
    const num = req.body
    //const file = req.file
    console.log(num)

    const result = await FileModel.updateOne({ _id: id }, num)

    // const result = await CourseModel.findByIdAndUpdate(id, req.body)
    console.log(result)
    return res.json(result)
})
module.exports = {
    updateFileById, getText, updateTextById,
    handleUpload, getFile, handleUploads, handleS3Upload, deleteFileS3, getAllFiles, deleteFile,getFilebyRoleID,getFilesByQuery
}