const Clarifai = require('clarifai');

// Api key from clarfai
const app = new Clarifai.App({
    apiKey: 'a63eb6eae69349969b0539d90a031bcd'
   });

const handleApiCall = (req,res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data)
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req,res,db) => {
    const{ id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}


