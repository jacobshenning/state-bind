# State Bind

[Demo Site](https://state-bind.jacobhenning.com)
![Screenshot of Demo](/screenshot.png)

### Setup Instructions

1. Clone the Repo to your local machine
2. Run `composer install` in the terminal
3. Run `npm install` in the terminal
4. Run `cp .env.example env` in the terminal
5. Add your [mysql](#Connect-Database) Credentials to the .env file in the project root
    - Open the project in your editor
    - Add database host, username, password, and port
6. Add [Twilio Credentials](#Twilio-Credentials) to the env file
    - Add Account SID
    - Add API KEY
    - Add API Secret
    - Add Chat Service SID
7. Run `php artisan key:generate` in your terminal
8. Run `php artisan migrate` in your terminal
9. Run `php artisan serve` in your terminal
10. Click [this link](http://127.0.0.1:8000)

### Connect Database

You can use any mysql for this. I use a brew mysql installation, but if you don't have a MySQL base up and running, I suggest you download MAMP.

### Twilio Credentials

You'll need to your twilio credentials to the env file.
