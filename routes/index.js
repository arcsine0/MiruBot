const express = require('express');
const multer = require('multer');
const path = require('path');
const readline = require('readline');
const { Readable } = require('stream');

const { judge } = require('../labelAI/judge');

var router = express.Router();

var upload = multer({ storage: multer.memoryStorage() });   

function bufferToStream(buffer) {
    const readableInstanceStream = new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    });
    return readableInstanceStream;
}

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Chat Analyzer' });
});
router.post('/upload', upload.single('logFile'), async function(req, res, next) {
    
    if (req.file !== undefined) {
        // read file upload
        var tempArr = [], chatArr = [];
        const rl = readline.createInterface({
            input: bufferToStream(req.file.buffer),
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
            let prevSender = '';
            tempArr.forEach(function (e, i) {
                var line = e.split(/:(.*)/);
                if (line.length < 2) {
                    chatArr.push([prevSender, line[0]]);
                } else {
                    chatArr.push([line[0], line[1]]);
                }
                prevSender = line[0];
            });
            let temp = chatArr.map(async function (e) {
                let judgement = await judge(e[1]);
                return { 'name': e[0], 'message': e[1], 'label': judgement };
            })
            let judgedArr = await Promise.all(temp);
            let jsonArr = JSON.stringify(judgedArr);
            res.send(jsonArr);

        });
    } else {
        res.send('NO DATA');
    }
})

function hasNum(inp) {
    return /\d/.test(inp);
}

module.exports = router;
