const path = require('path');
const fastText = require('fasttext');

let data = path.resolve(path.join(__dirname, './data/chatLogTraining.txt'));
let model = path.resolve(path.join(__dirname, './model/'));

let classifier = new fastText.Classifier();
let options = {
    input: data,
    output: model,
    lr: 0.1,
    loss: 'softmax',
    label: '_label_',
}

classifier.train('supervised', options)
    .then((res) => {
        console.log('model info after training', res);
    })