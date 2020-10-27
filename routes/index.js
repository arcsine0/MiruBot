const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { judge } = require('../labelAI/judge');

var router = express.Router();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function(req, file, cb) {
        cb(null, 'chatLog' + Date.now() + '.sbv');
    }
})
var upload = multer({ storage: storage });   


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Chat Analyzer' });
});
router.post('/upload', upload.single('logFile'), async function(req, res, next) {
    
    if (req.file !== undefined) {
        // read file upload
        var tempArr = [], chatArr = [];
        const rl = readline.createInterface({
            input: fs.createReadStream(path.join(req.file.path)),
            output: process.stdout,
            console: false,
            terminal: false
        });
        rl.on('line', function (line) {
            if (line.length !== 0) {
                if (!hasNum(line[0])) {
                    tempArr.push(line);
                }
            }
        }).on('close', async function () {
            tempArr.forEach(function (e, i) {
                var line = e.split(':');
                chatArr.push([line[0], line[1]]);
            });
            let temp = chatArr.map(async function (e) {
                let judgement = await judge(e[1]);
                return { 'name': e[0], 'message': e[1], 'label': judgement };
            })
            let judgedArr = await Promise.all(temp);
            let jsonArr = JSON.stringify(judgedArr);
            res.send(jsonArr);

            // remove upload file after use
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
            });
        });
    } else {
        res.send('NO DATA');
    }
})

function hasNum(inp) {
    return /\d/.test(inp);
}

module.exports = router;
