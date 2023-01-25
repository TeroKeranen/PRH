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

    // get url (no need)
    const URL = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&companyRegistrationFrom=2014-02-28"
    // SearchUrl 
    const searchUrl = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&businessId="
    

    
    // Get user business id input
    let businessId = req.body.businessId;
    
    // get data 
    async function getData(url) {
        
        try {
            

            let fetch_resp = await fetch(url)
            let json = await fetch_resp.json();
            
            let x = json.results;
            let companyName;
            let id;
            let businessLines;
            
            let wholeAddress;

            x.forEach((item) => {
                if (item.businessLines.length <= 0){
                    businessLines = "businessLines tietoja ei saatavilla"
                }
                
                companyName = item.name; // Save companys name to variable
                id = item.businessId; // save companys id to variable
                let i = item.addresses // Take adresses to own variable so you can iterate those
                
                i.forEach((addres) => {
                    let city; 
                    let street;
                    let postcode;

                    for (const [key,value] of Object.entries(addres)) {

                        // check if key is what whe want and save it into variable
                        if(key === "street"){
                            street = value
                        } 
                        // check if key is what whe want and save it into variable
                        if (key === "postCode") {
                            postcode = value
                        }
                        // check if key is what whe want and save it into variable
                        if (key === "city") {
                            city = value;
                        }
                    }
                    // save iterated address informations to own variable so we can pass whole address to website 
                    wholeAddress = `${street}, ${city}, ${postcode}`
                })
                
                
            })
            res.render('index', {name:companyName, address: wholeAddress, bussline: businessLines })
            
        } catch (error) {
            
                
            res.render('index', {errorMsg: "Ei löydy" })
        }
        
    }
    
    getData(searchUrl+businessId);
    
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
})