const express = require('express');

const app = express();



app.use('/test', (req,res)=>{
    res.send("THIS IS TESTING PAGE");
});

app.use("/admin", (req,res)=>{
    res.send("THIS IS ADMIN DASHBOARD");
});

app.use('/', (req,res)=>{
    res.send("THIS IS DASHBOARD");
});


app.listen(2511, (req,res)=>{
    console.log("listening to server");
    
})