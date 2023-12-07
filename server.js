const express = require('express');
const path = require('path');
const fs = require('fs');
//ssh -R 0:localhost:2560 serveo.net
const app = express();
const port = 3000;
const multer = require('multer');
const storagePath = path.join(__dirname, 'storage');

app.use(express.static(storagePath));

app.get('/listFiles', (req, res) => {
    fs.readdir(storagePath, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading storage directory');
        }

        res.json({ files });
    });
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(storagePath, filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        res.download(filePath, filename, (err) => {
            if (err) {
                return res.status(500).send('Error downloading file');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
