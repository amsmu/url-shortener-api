**Note: For this project I've used the basic Node.js and Express starter kit that we created at my previous job. I love that directory structure and generally start from there or would recreate it even if I've to start from scratch.**

## Run Commands
### npm install
### npm start
Apis will run on port:1337

## For Tests
### npm test

### Things I've accomplished
1. GET api for shortening the URL
2. POST api for check how many times a particular URL was shortened
3. Relevant test cases for both the apis
4. Database being used is MySQL. I'm using free service on [freemysqlhosting.net](https://freemysqlhosting.net)

## Description
### CODE
1. Code for the apis is in src/models/Url.js
2. Code for the routes is in config/routes/v1.js
3. Code for the tests is in test/app.test.js

### Database
1. It has two tables: url and shortened_url
2. url: (id, url, created_at). ID is auto_increment primary key and created_at is current date_time stamp and url is the url passed that needs to be shortened.
3. shortened_url: (id, url_id, shortened_url, user, created_at). ID is auto_increment primary key, created_at is current date_time stamp, url_id is id of url for which this record is being created, shortened_url is the shortened version of url passed and user field can store any meta data about user or can be NULL.

### Shortening URL API
1. This api first checks if the url is present or not in params. Then uses regex to validate if url passed is valid or not.
2. Then it checks if the url record was already created or not. If not then create the record.
3. Create a random and unique url which is accomplished in mysql query itself. It'll prevent collisions
4. Then it just returns just the shortened URL.

### URL usage API
1. This api first checks if the url is present or not in params. Then uses regex to validate if url passed is valid or not.
2. Fetches the count from the DB for the number of times that particular url has been shortened.
3. Then it just returns just the shortened URL.

### Tests
1. I'm using mocha and chai for the test.
2. I've added 7 relevant tests for the APIs.

