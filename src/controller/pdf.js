const asyncHandler = require("express-async-handler");
const path = require("path");
// const FileModel = require("../models/file");
// const path = require('path')
// const fs = require('fs');
// // const RoleModel = require("../models/role");
// const permissionsModel = require("../models/permissions");
// const PDFModel = require("../models/pdf");



// const handlePdfUpload = asyncHandler(async (req, res) => {

//     //const userId = claimTokenData(req)['id'];
//     console.log(req.body)
//     //const text = req.body.text;
//     const pdf = new PDFModel({
//     originalname: req.file.originalname,
//     userid:req.body.userid
//     })

//     pdf.save()
//     return res.json(pdf)
// })


// module.exports = {handlePdfUpload}
const OwnerModel = require("../models/owner");
const PDFModel = require("../models/pdf");
const QRCode = require("qrcode"); // Make sure to install this package

const fs = require('fs');

const getPDFbyUserID = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Find the user by ID
        const user = await OwnerModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const type = req.query;
        // Include the roleId in the query conditions
        const query = { ...type, userid: userId };

        // Find the PDF associated with the user and type
        const pdf = await PDFModel.findOne(query);

        if (!pdf) {
            return res.status(404).json({ message: "PDF not found for the given user" });
        }

        // Resolve the file path
        const filePath = path.join(__dirname, "./../../", pdf.path);
        console.log("File Path:", filePath);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on the server" });
        }

        // Send the file to the client
        return res.sendFile(filePath);

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});



// const UserModel = require("../models/user");
// const OwnerModel = require("../models/owner");

const handlePdfUpload = asyncHandler(async (req, res) => {
    try {
        console.log(req.body);

        // Create and save the PDF model
        const user = req.body.userid
        const pdf = new PDFModel({
            originalname: req.file.originalname, // Ensure req.file is populated correctly
            path:req.file.path,
            userid: user
        });

        await pdf.save();

        // Generate the link for the uploaded file (use your base API URL and file ID)
        const fileLink = `https://api.ezetech.online/v1/pdf/${user}`;
        // const fileLink = `https://api.ezetech.online/v1/files/679848ad991b18df46d05b11`;

        // Generate QR Code as Base64
        const qrCodeBase64 = await QRCode.toDataURL(fileLink);

        // Add QR Code and file link to the response
        return res.json({
            message: "PDF uploaded successfully!",
            pdf,
            fileLink,
            qrCode: qrCodeBase64
        });
    } catch (error) {
        console.error("Error handling PDF upload:", error);
        res.status(500).json({ error: "An error occurred while uploading the PDF." });
    }
});
module.exports = { handlePdfUpload,getPDFbyUserID };
