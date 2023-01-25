// require express
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))

// use public folder to use css styles
app.use(express.static('public'))


app.get("/", (req,res) => {

    
    res.render('index')
})


app.post("/businessid", (req,res) => {
    let businessId = req.body.businessId;
    console.log(businessId)

    res.render('index')
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
})