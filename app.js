// require express
const express = require('express');

const app = express();
const searchUrl = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&businessId="

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))

// use public folder to use css styles
app.use(express.static('public'))




app.get("/", (req,res) => {

    
    
        res.render('index', {name:"-",website: "-", street: "-", cities: "-", postcode: "-", busslineCode: "-",busslineName: "-", errorDisplay : false,errorType: "" })
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
                        // if bad Url request trow urierror
                        if (response.status == 400) {
                            throw URIError
                        }

                    }
                })
                .then((data) => {
                    
                    let companyName, id, businessLines,websites, websiteUrl,businessLineCode, businessLineName,adresses, wholeAddress, streetsArr, citiesArr, postcodeArr;
                    let jsonResults = data.results; // Get company data

                    jsonResults.forEach((item) => {
                        
                        // Katsotaan löytyykö businessLines tietoja 
                        if (item.businessLines.length <= 0) {
                            businessLineCode = "BusinessLineCode tietoa ei ole saatavilla";
                            businessLineName = "BusinessLineName tietoa ei ole saatavilla";
                            
                        } else {
                            businessLines = item.businessLines;
                            // Iterate businessline and take needed values to variables
                            businessLines.forEach((type) => {
                                
                                if(type.language === "FI") {
                                    
                                    businessLineCode = type.code;
                                    businessLineName = type.name
                                }
                            })
                        }

                        // katsotaan löytyykö nettisivuja
                        if (item.contactDetails.length <= 0) {
                            websiteUrl = "Nettisivuja ei löydettävissä";

                        } else {
                            item.contactDetails.forEach((type) => {
                                if(type.type === "Kotisivun www-osoite" && type.language === "FI") {
                                    websiteUrl = type.value;
                                } else {
                                    websiteUrl = "Nettisivuja ei löydettävissä"
                                }
                            })
                        }

                        companyName = item.name; // save companys name to variable
                        id = item.businessId;    // save companys id to variable
                        adresses = item.addresses; // save adresses to variable
                        
                        
                        let streets = []
                        let postcodes = []
                        let cities = []
                        
                        adresses.forEach((address) => {
                            
                            
                            


                            if (streets.includes(address.street)) {
                                
                            } else {
                                streets.push(address.street)
                                cities.push(address.city)
                                postcodes.push(address.postCode)
                            }

                                
                            
                        })
                        
                        streetsArr = streets
                        citiesArr =  cities
                        postcodeArr = postcodes
                            
                    })
                    
                    
                    res.render('index', {name:companyName, website: websiteUrl, street: streetsArr,cities:citiesArr,postcode:postcodeArr, busslineCode: businessLineCode,busslineName: businessLineName, errorDisplay : false, errorType: "" })
                })
                
                .catch(error => {
                    
                        // When catching error show error on page
                        res.render('index', {name:"companyName",website: "website", street: "street",cities:"cities",postcode:"postcode", busslineCode: "businessLineCode",busslineName: "businessLineName", errorDisplay : true, errorType: error.name })
                    
                    
                    
                })

            
            
        
        
    }
    
    getData(searchUrl+businessId);
    
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
})