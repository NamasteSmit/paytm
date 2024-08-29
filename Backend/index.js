const express = require('express');
const app =express();
const PORT = 8000;
const bodyParser = require('body-parser');
const apiRouter = require('./routes/index');



//middleware to extract body from request
app.use(express.json());
app.use(bodyParser.json());

//handle routes
app.use('/api/v1',apiRouter);
// app.use('/api/v1/user' , userRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})