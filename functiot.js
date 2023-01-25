const URL = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&companyRegistrationFrom=2014-02-28"
const searchUrl = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&businessId="
// const form = document.getElementById('form');
// const businessId = document.getElementById("businessId")
// const main = document.getElementById('main');





function fechtInformation (url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showData(data.results)
        })
}


function showData(data) {
    data.forEach(info => {
        const {businessId, name, addresses} = info;
        

        addresses.forEach((address) => {
            let street = address.street;
            let postCode = address.postCode;
            
            
            
            
            
        })
        let companyName = name;
        console.log("vittuuu")  
    })
    
}

module.exports = {
    fechtInformation

}