const countriesContainer = document.querySelector(".countries");
const inputField = document.getElementById("search-bar");
const btnRegions = document.getElementById("btnRegions");
const primaryHeading = document.querySelector(".primary-heading");
const regions = document.querySelectorAll(".filter-options p");
const sectionSearch = document.querySelector(".section-search");
const countryDetailsPage = document.querySelector(".country-details");

const renderCountry = function(data) { // data represents an array of country-objects that are fetched
    countriesContainer.innerHTML = '';
    const fetchedCountries = []

    data.forEach(function(country){
        const article = document.createElement("article");
        article.classList.add("country");
        article.setAttribute('data-code', `${country.alpha3Code}`);
        
        

        article.innerHTML = `
            <img class="country-img" src="${country.flag}" alt="">
            <div class="country-data">
                <h3 class="country-name">${country.name}</h3>
                <p class="country-row"><span>Population: </span>${(
                    +country.population / 1000000
                  ).toFixed(1)} millions</p>
                <p class="country-row"><span>Region: </span>${country.region}</p>
                <p class="country-row"><span>Capital: </span>${country.capital}</p>
            </div>
        `
        fetchedCountries.push(article);
    })

    countriesContainer.append(...fetchedCountries);
}

const getData = async function(url){
    try {
        const res = await fetch(url);
        const data = await res.json(); // data represents an array of country-objects that are fetched

        renderCountry(data);
        return data; 

    } catch(err) {
        console.log(err)
    }
}

const toggleRegions = () => {
    document.querySelector(".filter-options").classList.toggle("display-none")
}

// Initial Homepage displays all countries

const initialPageLoad = async function() {
    const data = await getData('https://restcountries.com/v2/all');
}

initialPageLoad();

primaryHeading.addEventListener("click", initialPageLoad);

// Search Countries: Input Event

inputField.addEventListener('input', function(e){
    const inputText = e.target.value;
    const url = `https://restcountries.com/v2/name/${inputText}`
    
    if(inputText.length >= 3){
        getData(url);
    } else if (inputText.length === 0){
        initialPageLoad();
    }
})

// Filter Regions Feature: Click Event

btnRegions.addEventListener("click", toggleRegions);

regions.forEach(region => {
    region.addEventListener("click", () => {
        // Hide Regions
        toggleRegions();

        const regionName = region.getAttribute("data-region")
        const url = `https://restcountries.com/v2/region/${regionName}`
        
        getData(url);
    })
})

// Country Details Page Features 

const renderCountryDetails = function(data){
    const html = `
        <div class="country-details__img">
            <img id="country-details-img" src="${data.flag}" alt="">
        </div>
        <div class="country-details__content">
            <h2 class="country-title">${data.name}</h2>
            <div class="country-details__data">
                <div>
                    <p><span>Native Name:</span> ${data.nativeName}</p>
                    <p><span>Population:</span> ${+data.population / 1000000}</p>
                    <p><span>Region:</span> ${data.region}</p>
                    <p><span>Subregion:</span> ${data.subregion}</p
                    <p><span>Capital:</span> ${data.capital}</p>
                </div>
                <div>
                    <p><span>Top Level Domain:</span> ${data.topLevelDomain[0]}</p>
                    <p><span>Currencies:</span> ${data.currencies[0].name}</p>
                    <p class="languages"><span>Languages:</span> ${getLanguages(data.languages)}</p>
                </div>
            </div>
            <div class="border-countries">
                <ul class="border-countries__list">
                    ${data.borders.map(borderCountry => {
                        console.log(borderCountry)
                        return `
                            <li class="border-country">${borderCountry.name}</li>
                        `
                    })}
                </ul>  
            </div>
        </div>       
    `
    document.querySelector(".country-details").insertAdjacentHTML("beforeend", html);
}

const getDataCode = async function(code){
    const res = await fetch(`https://restcountries.com/v2/alpha/${code}`)
    const data = await res.json();

    renderCountryDetails(data)
    return data;
}

countriesContainer.addEventListener("click", function(e){

    // Country Image: Click Event
    if(e.target.classList.contains("country-img")){
        const code = e.target.parentElement.getAttribute('data-code');

        // Display Country Details Page
        countriesContainer.classList.add("display-none");
        sectionSearch.classList.add("display-none");
        countryDetailsPage.classList.remove("display-none"); 
        
        getDataCode(code)
    }
})


// Languages?

function getLanguages(arr) {
    const languages = []
    arr.forEach(lang => {
        languages.push(lang.name)
    })

    return [...languages]
}
