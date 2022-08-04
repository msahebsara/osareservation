# OSA Reservation 

This project was created for the Old Scona Graduating Class of 2017. 
The codebase was given to the Class of 2018, who used it for their graduation banquet reservation. 

OSA Reservation is a banquet reservation form that allows the choosing of an allocated number of seats, visualizes tables including different showcase for taken seat, unavailable seats, and available seats. Users may also click on a table to view those already at that seat, allowing them to be beside friends. 
The application also features a password-protected admin panel so that the Student's Union is able to view, print, and manipulate the data to their liking. 

## Technologies Used
This application was made using Vue.js and Firebase. As this application was being hosted on a static server, the entire codebase is client side (excluding the admin panel which is a simple PHP script that was hosted externally). 
Validation is being done on the front-end to ensure that two users don't reserve the same seats, as well as validation for correct number of seats against the number in the Firebase database, and valid values for name. 

## Usage
- Setup Firebase config details in material.js and admin.js
- Run index.html 


