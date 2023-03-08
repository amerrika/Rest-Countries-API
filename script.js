const countriesContainer = document.querySelector(".countries");
const inputField = document.getElementById("search-bar");
const btnRegions = document.getElementById("btnRegions");
const heading = document.querySelector(".primary-heading");
const regions = document.querySelectorAll(".filter-options p");

const renderCountry = function(data) { // data represents an array of country-objects that are fetched
    countriesContainer.innerHTML = '';
    const fetchedCountries = []

    data.forEach(function(country){
        const article = document.createElement("article");
        article.classList.add("country");

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
        const data = await res.json();

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

heading.addEventListener("click", initialPageLoad);

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

// Region Options Toggle: Click Event

btnRegions.addEventListener("click", toggleRegions)

// Filter Regions

regions.forEach(region => {
    region.addEventListener("click", () => {
        // Hide Regions
        toggleRegions();

        const regionName = region.getAttribute("data-region")
        const url = `https://restcountries.com/v2/region/${regionName}`
        
        getData(url);
    })
})