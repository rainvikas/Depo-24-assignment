const express = require('express');
const bodyParser = require('body-parser');

const route = require('./Routes/route.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://rahat6713:1819rahat@cluster0.iee0y.mongodb.net/hackathon?retryWrites=true&w=majority", {useNewUrlParser: true})
    .then(() => console.log('mongodb running on '))
    .catch(err => console.log(err))

    app.use('/', route);

app.listen(process.env.PORT || 3002, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3002))
});


