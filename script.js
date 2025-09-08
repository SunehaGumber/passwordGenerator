const inputSlider = document.querySelector('[data-lengthslider]');
const displayPass = document.querySelector('[data-passwordDisplay]');
const upper = document.querySelector('#uppercase');
const lower = document.querySelector('#lowercase');
const number = document.querySelector('#numbers');
const symbols = document.querySelector('#symbols');
const copyBtn = document.querySelector('[data-copy]');
const generateBtn = document.querySelector('.gen-btn');
const lengthDisplay = document.querySelector('[data-length]');
const indicator = document.querySelector('[data-indicator]');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const copymessage = document.querySelector('[data-copyMsg]');

let password = "";
let passwordLength = 10;
let checkCount = 0;

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}
handleSlider();

setIndicator("#ccc");
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
   
function getRndinteger(min, max) {
    return Math.floor(Math.random() * (max - min))+min;
}

function generateRandomNumber() {
   return  getRndinteger(0, 9);
}

function generateLowercase() {
   return String.fromCharCode(getRndinteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndinteger(65, 91));
}

const stringSymbols = '~!@#%^&*()_-+=:;"<,>.?/';

function generateSymbols() {
    const randomNumber = getRndinteger(0, stringSymbols.length);
    return stringSymbols.charAt(randomNumber);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upper.checked) hasUpper = true;
    
    if (lower.checked) hasLower = true;
    
    if (number.checked) hasNum = true;
    
    if (symbols.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) &&(hasNum||hasSym) && (passwordLength >=6)){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}
// basically ye chij password ko copy krne k liye h

async function copyContent() {
    try {
        await navigator.clipboard.writeText(displayPass.value);//may create error
        copymessage.innerText = "copied";
    }
    catch (e) {
        copymessage.innerText = "failed";
    }
    // to make span visible
    copymessage.classList.add("active");
    setTimeout(() => {
        copymessage.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (displayPass.value) copyContent();
});

function handleCheckboxchange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    }) 
    // special case

    if (passwordLength < checkCount) {
        passwordLength=checkCount;
        handleSlider();
    }
}
 
allCheckBox.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxchange);
})

function shufflePass(array) {
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => str += el);
    return str;
    
}
generateBtn.addEventListener('click', () => {
    //none of the checkboxes selected

    if (checkCount <= 0) {
        return;
    }
    
    if (passwordLength < checkCount) {
        passwordLength=checkCount;
        handleSlider();
    }
    //  let's find new password

    password = "";


    // if (upper.checked) {
    //     password += generateUpperCase();
    // }
    // if (lower.checked) {
    //     password += generateLowercase();
    // }
    // if (number.checked) {
    //     password += generateRandomNumber();
    // }
    // if (symbols.checked) {
    //     password += generateSymbols();
    // }

    let funcArr = [];

    if (upper.checked) {
        funcArr.push(generateUpperCase)
    }
    if (lower.checked) {
        funcArr.push(generateLowercase);
    }
    if (number.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbols.checked) {
        funcArr.push(generateSymbols);
    }
    for (let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }
    // remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++){
        let randomindex = getRndinteger(0, funcArr.length);
        password += funcArr[randomindex]();
    }

    // shuffle pass
    password = shufflePass(Array.from(password));
    
    displayPass.value = password;
   
    // calculate strength

    calcStrength();
})