// require express
const express = require('express');

const app = express();
const searchUrl = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&businessId="

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))

// use public folder to use css styles
app.use(express.static('public'))




app.get("/", (req,res) => {

    
    res.render('index', {data: "Moro"})
})


app.post("/businessid", async (req,res) => {


    const URL = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&companyRegistrationFrom=2014-02-28"
    const searchUrl = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&businessId="
    const id = "3340433-5"
// const form = document.getElementById('form');
    
      
    let businessId = req.body.businessId;
    
    async function getData(url) {
        let fetch_resp = await fetch(url)
        let json = await fetch_resp.json();
        let x = json.results;
        let companyName;
        

        x.forEach((item) => {
            companyName = item.name;
        })
        res.render('index', {data:y })
    }
    
    getData(searchUrl+id);
    
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
})