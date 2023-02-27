const express = require('express')

const mongoose = require('mongoose');
const app = express();

app.use(express.json());



mongoose.connect("mongodb+srv://functionup-cohert:yCRgEggIFfjlaB8o@sl0yd7n.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )
//yCRgEggIFfjlaB8o@
var Users = require('./routes/USers');
app.use('/users', Users);


//app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})