const asyncHandler = require("express-async-handler");
const path = require("path");
const OwnerModel = require("../models/owner");
const PDFModel = require("../models/pdf");
const QRCode = require("qrcode"); // Make sure to install this package
const fs = require('fs');
const mime = require('mime-types');

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

const mongoose = require("mongoose");
// const fs = require("fs").promises;
// const path = require("path");
// const asyncHandler = require("express-async-handler");
// const PDFModel = require("../models/PDFModel");

// const fs = require('fs').promises; // Use promises for asynchronous file operations
// const path = require('path');
// const asyncHandler = require('express-async-handler');
// const PDFModel = require('../models/pdf'); // Adjust the path to your PDFModel

// const fs = require('fs').promises; // Use fs.promises
// const path = require('path');
// const asyncHandler = require('express-async-handler');
// const PDFModel = require('../models/pdfModel'); // Adjust the path based on your project

// const deletePDFByUserID = asyncHandler(async (req, res) => {
//     try {
//         const id = req.params.id;
//         if (!id || typeof id !== 'string') {
//             return res.status(400).json({ message: 'Invalid ID' });
//         }

//         const trimmedId = id.trim();

//         // ✅ Find the file by ID
//         const file = await PDFModel.findById(trimmedId);

//         // ✅ Check if the file exists
//         if (!file) {
//             return res.status(404).json({ message: 'File not found' });
//         }

//         // ✅ Construct the full file path
//         const filePath = path.join(__dirname, './../../', file.path);

//         // ✅ Delete the file if it exists
//         try {
//             await fs.promises.unlink(filePath); // Correct way to use fs.promises.unlink
//             console.log('File deleted successfully:', filePath);
//         } catch (err) {
//             if (err.code !== 'ENOENT') {
//                 console.error('Error deleting file:', err);
//                 return res.status(500).json({ message: 'Error deleting file' });
//             }
//             console.log('File does not exist:', filePath);
//         }

//         // ✅ Delete the file document from the database
//         const result = await PDFModel.deleteOne({ _id: trimmedId });

//         // ✅ Return the result
//         return res.json({ message: 'File deleted successfully', result });
//     } catch (error) {
//         console.error('Error deleting file:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// });






const deletePDFByUserID = asyncHandler(async (req, res) => {
    try {
        const { userid } = req.params;

        if (!userid || !mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        // ✅ Find all files by userid
        const files = await PDFModel.find({ userid });

        // ✅ Check if files exist
        if (!files.length) {
            return res.status(404).json({ message: 'No files found for this user' });
        }

        // ✅ Delete each file from the filesystem
        for (const file of files) {
            const filePath = path.join(__dirname, './../../', file.path);
            try {
                await fs.promises.unlink(filePath);
                console.log('File deleted:', filePath);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ message: 'Error deleting some files' });
                }
                console.log('File does not exist:', filePath);
            }
        }

        // ✅ Delete all files from the database
        const result = await PDFModel.deleteMany({ userid });

        return res.json({ message: 'Files deleted successfully', result });
    } catch (error) {
        console.error('Error deleting files:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// module.exports = deletePDFsByUserID;


// module.exports = deletePDFByUserID;


// module.exports = deletePDFByUserID
// module.exports = deletePDFByUserID;




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



const getPDFBase64byUserID = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Find the user by ID
        const user = await OwnerModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const type = req.query;
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

        // Get the file MIME type dynamically
        const mimeType = mime.lookup(filePath) || 'application/pdf';

        // Read the file and encode it to Base64
        const fileBuffer = fs.readFileSync(filePath);
        const base64PDF = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

        // Return the Base64-encoded PDF in the response
        return res.status(200).json({
            message: "PDF retrieved successfully!",
            pdf: {
                filename: pdf.originalname,
                mimeType: mimeType,
                base64: base64PDF
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});




const getQrBase64ByUserID = asyncHandler(async (req, res) => {
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

        // Generate a link to the PDF (or use any metadata for the QR code)
        const pdfLink = `https://api.ezetech.online/v1/pdf/${userId}`; // Example link

        // Generate the QR code as a Base64-encoded string
        const qrCodeBase64 = await QRCode.toDataURL(pdfLink);

        // Return the Base64-encoded QR code in the response
        return res.status(200).json({
            message: "QR code generated successfully!",
            qrCode: qrCodeBase64
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});




const getFileBase64byUserID = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID
        const user = await OwnerModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const type = req.query;
        const query = { ...type, userid: userId };

        // Find the file associated with the user
        const file = await FileModel.findOne(query);

        if (!file) {
            return res.status(404).json({ message: "File not found for the given user" });
        }

        // Resolve the file path
        const filePath = path.join(__dirname, "./../../", file.path);
        console.log("File Path:", filePath);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on the server" });
        }

        // Get MIME type dynamically based on file extension
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';

        // Read the file and encode it to Base64
        const fileBuffer = fs.readFileSync(filePath);
        const base64File = fileBuffer.toString('base64');

        // Return the Base64-encoded file with the correct data URL format
        return res.status(200).json({
            message: "File retrieved successfully!",
            file: {
                filename: file.originalname,
                mimeType: mimeType,
                base64: `data:${mimeType};base64,${base64File}`
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


const handleImageUpload = asyncHandler(async (req, res) => {
    try {
        // Extract user ID and base64 image from the request body
        const { userid, base64Image } = req.body;

        // Validate input
        if (!userid || !base64Image) {
            return res.status(400).json({ error: "Missing userid or base64 image." });
        }

        // Decode the base64 image and save it to the server as a file
        const imagePath = `uploads/${Date.now()}.png`;  // Save it with a unique name
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const fs = require('fs');
        fs.writeFileSync(imagePath, imageBuffer);  // Save the image to the server

        // Create and save the image model (using PDFModel for consistency)
        const image = new PDFModel({
            originalname: `${userid}-image.png`, // Assign a unique name for the image
            path: imagePath,
            userid: userid
        });

        await image.save();

        // Generate the link for the uploaded image (use your base API URL and user ID)
        const fileLink = `https://api.ezetech.online/v1/images/${userid}`;

        // Generate the QR Code as Base64
        const qrCodeBase64 = await QRCode.toDataURL(fileLink);

        // Return the response with the image metadata, file link, and QR code
        return res.json({
            message: "Image uploaded successfully!",
            image,
            fileLink,
            qrCode: qrCodeBase64
        });
    } catch (error) {
        console.error("Error handling image upload:", error);
        res.status(500).json({ error: "An error occurred while uploading the image." });
    }
});


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
const handleGetQR = asyncHandler(async (req, res) => {
    try {
        console.log(req.body);

        // Generate the link for the uploaded file (use your base API URL and file ID)
        const user = req.params.id;
        const fileLink = `https://api.ezetech.online/v1/pdf/${user}`;

        // Generate QR Code as Base64
        const qrCodeBase64 = await QRCode.toDataURL(fileLink);

        // Return only the QR Code
        return res.json({
            qrCode: qrCodeBase64
        });
    } catch (error) {
        console.error("Error generating QR Code:", error);
        res.status(500).json({ error: "An error occurred while generating the QR Code." });
    }
});
module.exports = { handlePdfUpload,
    getPDFbyUserID,
    handleGetQR,
    handleImageUpload,
    getPDFBase64byUserID,
    getQrBase64ByUserID,
    deletePDFByUserID};
