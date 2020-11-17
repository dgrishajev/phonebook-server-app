# Phonebook API

### How to run

Clone the repo and install the dependencies with `npm i`.

Create a `.env` file in the root with the following content:
```
MONGODB_URI='mongodb+srv://username:password@cluster0.peec3.mongodb.net/db-name?retryWrites=true&w=majority'
PORT=3001
```
Where `MONGODB_URI` is a link to your MongoDB Atlas Cluster (in order to create one sign up [here](https://www.mongodb.com/cloud/atlas/register) and follow [these instructions](https://docs.atlas.mongodb.com/tutorial/create-new-cluster)).

Kill processes on port 3001 if any and then start the server with `npm run dev`.

### How to use

The base URL is http://localhost:3001, the main endpoints are the following:

* GET /info (static page)
* GET /api/persons
* GET /api/persons/:id
* PUT /api/persons/:id
* POST /api/persons
* DELETE /api/persons/:id

### How to deploy

* Generate a [front-end](https://github.com/dgrishajev/fso-submissions/tree/main/part3/phonebook) `build` directory and place it at the root of this app
* [Create](https://signup.heroku.com/) a Heroku account and [install](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) its CLI on your machine
* Create a Heroku application with `heroku create`
* Commit your changes to GitHub with `git push origin main`
* Push everything to Heroku with `git push heroku main`

The console should output the link to the deployed app which you can follow (in case of any errors check the logs with `heroku logs -t`).

### Live demo

Sample version of this app is available [here](https://young-cliffs-17816.herokuapp.com). Cross-origin requests are allowed.

### CLI usage

You can run `mongo.js` from your terminal with either of these commands:

```
$ node mongo.js yourpassword
$ node mongo.js yourpassword personname personnumber
```

`mongo.js` either enlists `Person` entries (1st command) or adds a new `Person` entry (2nd command) to a MongoDB collection at the `url` you specify in the file.
