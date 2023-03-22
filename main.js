const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const passwordRetype = document.getElementById('passwordRetype');
const apartment = document.getElementById('apartment');

const sumbitBtn = document.getElementById('sumbitBtn');

const errorMessageFirstName = document.getElementById('errorMessageFirstName');
const errorMessageLastName = document.getElementById('errorMessageLastName');
const errorMessageEmail = document.getElementById('errorMessageEmail');
const errorMessagePassword = document.getElementById('errorMessagePassword');
const errorMessagePasswordRetype = document.getElementById('errorMessagePasswordRetype');
const errorMessageApartment = document.getElementById('errorMessageApartment');
const errorMessage = document.getElementById('errorMessage');

let validator = {
    "firstName": false,
    "lastName": false, 
    "email": false,
    "password": false,
    "passwordRetype": false,
    "apartment": false
}

sumbitBtn.addEventListener('click', checkFields)
firstName.addEventListener('blur', ()=> {
    if (firstName.value.trim() === '') {
        errorMessageFirstName.textContent = 'Моля, въведете име';
        errorMessageFirstName.style.display = 'block'
        validator.firstName = false
    } else {
        errorMessageFirstName.textContent = '';
        errorMessageFirstName.style.display = 'none';
        validator.firstName = true;
    }
})

lastName.addEventListener('blur', ()=> {
    if (lastName.value.trim() === '') {
        errorMessageLastName.textContent = 'Моля, въведете фамилия';
        errorMessageLastName.style.display = 'block';
        validator.lastName = false;
    } else {
        errorMessageLastName.textContent = '';
        errorMessageLastName.style.display = 'none';
        validator.lastName = true;
    }
})

email.addEventListener('blur', ()=> {
    let checkEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (email.value.match(checkEmail)) {
        errorMessageEmail.textContent = '';
        errorMessageEmail.style.display = 'none';
        validator.email = true;
    } else {
        errorMessageEmail.textContent = 'Невалиден имейл адрес';
        errorMessageEmail.style.display = 'block';
        validator.email = false;
    }
})

password.addEventListener('input', ()=> {

    let checkPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    if (password.value.match(checkPassword)) {
        errorMessagePassword.style.display = 'block';
        errorMessagePassword.textContent = 'Всички условия са изпълненни.' 
        errorMessagePassword.style.color = 'green';
        validator.password = true;
    } else {
        errorMessagePassword.style.display = 'block';
        errorMessagePassword.style.color = 'red';
        errorMessagePassword.textContent = 'Паролата трябва да е поне 8 знака, да съдържа главни и малки букви, поне една цифра и поне един специален символ.';
        validator.password = false;
    }
})
password.addEventListener('blur', () => {
    if (validator.password === true) {
        errorMessagePassword.textContent = '';
        errorMessagePassword.style.display = 'none';
    }
})

passwordRetype.addEventListener('blur', () => { 
    if (password.value !== passwordRetype.value) {
        errorMessagePasswordRetype.textContent = 'Паролите не съвпадат'
        errorMessagePasswordRetype.style.display = 'block';
        validator.passwordRetype = false;
    } else {
        errorMessagePasswordRetype.textContent = ''
        errorMessagePasswordRetype.style.display = 'none';
        validator.passwordRetype = true;
    }
})
apartment.addEventListener('blur', () => {
   let ap = apartment.value * 1 
    if (Number.isInteger((ap)) && ap >= 1 && ap <= 8) {
        errorMessageApartment.textContent = '';
        errorMessageApartment.style.display = 'none';
        validator.apartment = true;
    } else {
        errorMessageApartment.textContent = 'Несъществуващ апартамент';
        errorMessageApartment.style.display = 'block';
        validator.apartment = false;
    }

})

function checkFields() {
    if (firstName.value === '' || lastName.value === ''
        || email.value === '' || password.value === '' ||
        passwordRetype === '' || apartment === '') {
        errorMessage.style.display = 'block'
        errorMessage.textContent = '* Моля, попълнете всички задължитени полета.';
    } else {
        errorMessage.style.display = 'none'
        errorMessage.textContent = '';
    }
    let checker = []
    for (const key in validator) {
        checker.push(validator[key]);
    }
    if (checker.every(x => x === true)) {
        postUserData()
    }
}

function postUserData() {
    fetch("http://127.0.0.1:5000/register", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://127.0.0.1:5000/register"
        },
        body: JSON.stringify(
            {
                "first_name": firstName.value, 
                "last_name": lastName.value, 
                "email": email.value, 
                "phone": phone. value, 
                "password": password.value, 
                "apartment": apartment.value * 1 })})
    .then(response => response.json())
    .then((data) => {
        let output = [];
        if (data.message){
            if (data.message.password) {
                for (const key in data.message.password) {
                    if (data.message.password[key] !== null) {
                        output.push(data.message.password[key]) 
                    }
                }
            }
            if (data.message.email) {
                output.push(`Потребител с такъв имейл вече съществува.`)
            }
            if (data.message.apartment) {
                output.push(data.message.apartment)
            }

            errorMessage.innerHTML = output.join('<br>');
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
        } else {
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'green';
            errorMessage.textContent = 'Потребителя е създаден';
            window.localStorage.setItem("token", data.token);
            window.location.replace("http://127.0.0.1:5500/login.html");
            // window.localStorage.getItem(key);
        }
        
    })
    .catch((error) => {
        console.log("Error:", error);
        errorMessage.style.display = 'block';
        errorMessage.style.color = 'red';
        errorMessage.textContent = 'Нещо се обърка'
    });
}
