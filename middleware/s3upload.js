import upload from "../config/s3.config.js";

// Configuring Multer to handle multiple files (songFile and albumCover)
const uploadFiles = upload.fields([
    { name: 'songFile', maxCount: 1 },
    { name: 'albumCover', maxCount: 1 }
]);

export const uploadSongAndCover = (req, res, next) => {
    try {
        uploadFiles(req, res, function(error) {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Unable to upload files",
                    err: error,
                });
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    message: "No files were uploaded",
                });
            }

            // Extracting the uploaded file locations from the request
            const songFileLocation = req.files.songFile ? req.files.songFile[0].location : null;
            const albumCoverLocation = req.files.albumCover ? req.files.albumCover[0].location : null;

            // Adding file locations to the request body
            req.body.songFileUrl = songFileLocation;
            req.body.albumCoverUrl = albumCoverLocation;

            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to upload files",
            err: error,
        });
    }
};
