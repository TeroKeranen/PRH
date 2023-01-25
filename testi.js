const URL = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&companyRegistrationFrom=2014-02-28"
const searchUrl = "https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=10&resultsFrom=0&businessId=3340433-5"
const id = "3340433-5"
// const form = document.getElementById('form');

const information = fetch(searchUrl) 
    .then((response) => response.json())
    .then ((info) => {
        return info
    })


const display = async () => {
    const a = await information;
    console.log(a)
}

display();