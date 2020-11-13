const mongoose = require('mongoose')

const { argv } = process

if (argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const [, , password] = argv

const url =
  `mongodb+srv://dgrishajev:${password}@cluster0.peec3.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (argv.length > 3) {
  const [, , , name, number] = argv

  const person = new Person({ name, number })

  person.save().then(res => {
    console.log('person saved!')
    console.log(res)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(res => {
    res.forEach(item => console.log(item))
    mongoose.connection.close()
  })
}
