import { setRate } from "./db";

const fromSelect = document.querySelector('#from');
const toSelect = document.querySelector('#to');
let forwardRate; 
let backwardRate; 
let rate;

function getCurrency(){
    fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(
        (currencies) => {
            return currencies.json();
        }).then((currencies) => {
            let db_index = 0;
        for(let currency in currencies.results){
            let opt  = document.createElement('option');
            let opt1 = document.createElement('option');
            opt.value = currency
            opt1.value = currency;
            opt.innerHTML =  currency
            opt1.innerHTML = currency;
            fromSelect.appendChild(opt);
            toSelect.appendChild(opt1);
            db_index++;  
            saveCurrencies(db_index, currency);          
        }
    })
}


function getRate(){
    const fromCurrency = document.querySelector('#from').value;
    const toCurrency = document.querySelector('#to').value;
    console.log(fromCurrency,toCurrency);
    const forwardQuery = `${fromCurrency}_${toCurrency}`;
    const backwardQuery = `${toCurrency}_${fromCurrency}`;
    const query = `${forwardQuery},${backwardQuery}`;
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}`).then(
        (response)=>{
            return response.json();
        }
    ).then(
        (response) => {
            forwardRate = response.results[forwardQuery].val;
            backwardRate = response.results[backwardQuery].val;
            rate = forwardRate;
            saveRate(fromCurrency,toCurrency,forwardRate,backwardRate);
        }
    ).catch(()=>{

    })
}

function saveCurrencies(index, currency){
    setCurrencies(index, currency);
}

function saveRate(from, to, forward_rate, backward_rate){
    setRate(`${from}_${to}`, forward_rate);
    setRate(`${to}_${from}`, backward_rate);
}

function getRateFromDB(from, to){
 
}

function calculateExchange(){
    document.querySelector('#to_value').value = document.querySelector('#from_value').value * rate;
}

function swap(){
    console.log(rate,forwardRate,backwardRate);
    rate = backwardRate;
    backwardRate = forwardRate;
    forwardRate = rate;
    const tmpValue = document.querySelector('#from').value;
    document.querySelector('#from').value = document.querySelector('#to').value;
    document.querySelector('#to').value = tmpValue;
    calculateExchange();
}

function init(){
    getCurrency();
    getRate();
    document.querySelector('#from_value').value = 0; 
}

init();