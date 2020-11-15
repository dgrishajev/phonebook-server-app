require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', ({ body }) => JSON.stringify(body))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: ({ method }) => method !== 'POST'
}))

const Person = require('./models/person')

app.get('/info', (req, res) => {
  Person.find({}).then(people => res.send(`
    <p>Phonebook has info for ${people.length} <a href="/api/persons">people</a></p>
    <p>${new Date()}</p>
  `))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => res.json(people))
})

app.get('/api/persons/:id', ({ params: { id } }, res) => {
  Person.findById(id).then(person => res.json(person))
})

app.post('/api/persons', ({ body }, res) => {
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Both name and number required'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(response => res.json(response))
})

app.put('/api/persons/:id', ({ body, params }, res, next) => {
  const { number } = body

  Person
    .findByIdAndUpdate(params.id, { number }, { new: true})
    .then(result => res.json(result))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const { PORT } = process.env

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
