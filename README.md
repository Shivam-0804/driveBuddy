Project: Drive Buddy - Carpooling System

Welcome to Drive Buddy! This project aims to provide a convenient carpooling system utilizing HTML, CSS, JavaScript, PHP, and the Google Maps API. This README file serves as a guide to set up and understand the project structure.

Features:
User registration and authentication.
Ability to create and manage carpooling events.
Real-time tracking of rides using Google Maps API.
Interactive user interface for a seamless experience.
Integration with XAMPP for PHP connectivity.

Project Structure:
index.html: This file serves as the main entry point of the application. It contains the landing page and user interface components.
style.css: This file contains the CSS styling for the entire project, ensuring a visually appealing design.
script.js: JavaScript functions are defined in this file to handle dynamic behavior and interactions within the application.
map.html: uses google maps api to provide the map interface

Installation:
Clone the repository into your local machine's htdocs directory within XAMPP.

Copy code
git clone <repository_url> C:\xampp\htdocs\drive_buddy

Import the database.sql file into your MySQL database to set up the required tables and schema.
Ensure that XAMPP is running, including the Apache and MySQL services.
Open your web browser and navigate to http://localhost/drive_buddy/index.html to access the Drive Buddy application.

Configuration:
Google Maps API Key: Replace the placeholder API key in the JavaScript code with your own Google Maps API key. You can obtain a key from the Google Cloud Console.
