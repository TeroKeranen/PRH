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

    
    // SearchUrl 
    const searchUrl = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&businessId="
    

    
    // Get user business id input
    let businessId = req.body.businessId;
    
    // get data function. functions parameter consist of the searchUrl and the id
    async function getData(url) {
            
            // fetch resource from a server
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
                    // variables we need
                    let companyName, id, businessLines, websiteUrl,businessLineCode, businessLineName,adresses, streetsArr, citiesArr, postcodeArr;
                    let jsonResults = data.results; // Get company data

                    console.log(jsonResults.addresses)
                    // loop companys data
                    jsonResults.forEach((item) => {
                        
                        // if there is no businesslines information or its empthy it will display something on page 
                        if (item.businessLines.length <= 0) {
                            businessLineCode = "BusinessLineCode tietoa ei ole saatavilla";
                            businessLineName = "BusinessLineName tietoa ei ole saatavilla";
                            
                        } else {
                            businessLines = item.businessLines;
                            // Iterate businessline and take needed values to variables
                            businessLines.forEach((type) => {
                                // take an item that has language value as Finland
                                if(type.language === "FI") {
                                    
                                    // get code and name from the object
                                    businessLineCode = type.code;
                                    businessLineName = type.name
                                }
                            })
                        }

                        // if there is no contactDetails display something on page
                        if (item.contactDetails.length <= 0) {
                            websiteUrl = "Nettisivuja ei löydettävissä";

                        } else {
                            // if contactDetails is not empthy check if object language is Finland and and check if there is website url
                            item.contactDetails.forEach((type) => {
                                if(type.type === "Kotisivun www-osoite" && type.language === "FI") {
                                    websiteUrl = type.value;
                                } else {
                                    // if there is no website url display this on the page
                                    websiteUrl = "Nettisivuja ei löydettävissä"
                                }
                            })
                        }

                        companyName = item.name; // save companys name to variable
                        id = item.businessId;    // save companys id to variable
                        adresses = item.addresses; // save adresses to variable
                        
                        
                        let streets = [] // save streets values inside the array
                        let postcodes = [] // save postcode values inside the array
                        let cities = [] // save city values inside the array
                        
                        // Loop companys addresses
                        adresses.forEach((address) => {
                            
                            
                            

                            // if  streets array includin looped value then dont do anything
                            if (!streets.includes(address.street)) {
                                streets.push(address.street)
                                cities.push(address.city)
                                postcodes.push(address.postCode)
                                // if street value is not in streets array, push it to array 
                            }

                                
                            
                        })
                        // Use this when rendering values to page
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
    
    // call function with constant searchUrl and with the id value given by the customer
    getData(searchUrl+businessId);
    
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
})