// require express
const express = require('express');

const app = express();
const searchUrl = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&businessId="

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))

// use public folder to use css styles
app.use(express.static('public'))




app.get("/", (req,res) => {

    
    
        res.render('index', {name:"companyName", address: "wholeAddress", bussline: "businessLines" })
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


            await fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.error(response.status, response.statusText)
                    }
                })
                .then((data) => {
                    
                    let companyName, id, businessLines,adresses, wholeAddress;
                    let jsonResults = data.results; // Get company data

                    jsonResults.forEach((item) => {
                        // Katsotaan löytyykö businessLines tietoja 
                        if (item.businessLines.length <= 0) {
                            businessLines = "BusinessLines tietoa ei ole saatavilla";
                        } else {
                            businessLines = item.businessLines;
                        }

                        companyName = item.name; // save companys name to variable
                        id = item.businessId;    // save companys id to variable
                        adresses = item.addresses; // save adresses to variable
                        

                        adresses.forEach((address) => {
                            let city,street,postcode;

                            for (const [key,value] of Object.entries(address)) {

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
                    
                    res.render('index', {name:companyName, address: wholeAddress, bussline: businessLines, error: err })
                })
                .catch(error => {
                    
                    console.error(error)
                })

            
            
        
        
    }
    
    getData(searchUrl+businessId);
    
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
})