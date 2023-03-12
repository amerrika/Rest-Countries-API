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

        console.log(data)
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

countriesContainer.addEventListener("click", function(e){
    if(e.target.classList.contains("country-img")){
        const code = e.target.parentElement.getAttribute('data-code');
        console.log(code);
        
        // Fetch Country Object
        (async () => {
            const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
            const data = await res.json();

            // Display Country Details Page
            countriesContainer.classList.add("display-none");
            sectionSearch.classList.add("display-none");
            countryDetailsPage.classList.remove("display-none");

            // Create HTML
            console.log(data[0].flags.png)
            const html = `
                <div class="country-details__img">
                    <img id="country-details-img" src="${data[0].flags.png}" alt="">
                </div>
                <div class="country-details__content">
                    <h2 class="country-title">${data[0].name.common}</h2>
                    <div class="country-details__data">
                        <div>
                            <p><span>Native Name:</span> ${data[0].name.nativeName.sqi.official}</p>
                            <p><span>Population:</span> 11,319,511</p>
                            <p><span>Region:</span> Europe</p>
                            <p><span>Subregion:</span> Western Europe</p>
                            <p><span>Capital:</span> Brussels</p>
                        </div>
                        <div>
                            <p><span>Top Level Domain:</span> .be</p>
                            <p><span>Currencies:</span> Euro</p>
                            <p><span>Languages:</span> Dutch, French, German</p>
                        </div>
                    </div>
                    <div class="border-countries">
                        <p><span>Border Countries:</span> France, Germany, Netherlands</p>
                    </div>
                </div>       
            `
            document.querySelector(".country-details").insertAdjacentHTML("beforeend", html);
            })();
    }
})