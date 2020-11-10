const path = require('path');
const fastText = require('fasttext');
const util = require('util');

const model = path.resolve(path.join(__dirname, './model/model.bin'));
const classifier = new fastText.Classifier(model);

module.exports.judge = async function(string) {
    let response = await classifier.predict(string, 1);
    if (response.length > 0) {
        let judgeString  = response[0].label.replace('_label_', '');
        return judgeString;
    } else {
        return 'No Matches';
    }
    
}