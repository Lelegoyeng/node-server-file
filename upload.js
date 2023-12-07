const express = require('express');
const multer = require('multer');
const path = require('path'); // Tambahkan modul path
const app = express();
const port = 3000;

// --------------------------- Storage Upload --------------------------- //
const storagePath = path.join(__dirname, 'storage');
app.use(express.static(storagePath));

const storage = multer.diskStorage({
    destination: './storage/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
}).single('myFile');

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else {
            res.json({ message: 'File uploaded successfully' });
        }
    });
});

// --------------------------- Storage Download --------------------------- //
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
    console.log(`Server is running on port ${port}`);
});
