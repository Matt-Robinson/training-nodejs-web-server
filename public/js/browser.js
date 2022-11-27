const weatherForm = document.querySelector('form')
const locationInput = document.querySelector('input')

// Manipulating html content example
// const errorMessageDiv = document.querySelector('#error-message')
// errorMessageDiv.textContent = 'This is an error message to display'
const infoMessageDiv = document.querySelector('#info-message')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const location = locationInput.value
    // if (location.trim() !== "" )
    infoMessageDiv.textContent = 'Loading...'
    window.location.href = '/weather?location=' + location
})