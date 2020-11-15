require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', ({ body }) => JSON.stringify(body))

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: ({ method }) => method !== 'POST'
}))

let persons = [{
  id: 1,
  name: 'Arto Hellas',
  number: '040-123456',
}, {
  id: 2,
  name: 'Ada Lovelace',
  number: '39-44-5323523',
}, {
  id: 3,
  name: 'Dan Abramov',
  number: '12-43-234345',
}, {
  id: 4,
  name: 'Mary Poppendick',
  number: '39-23-6423122',
}]

const Person = require('./models/person')

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Phonebook API</h1>
    <ul>
      <li>
        <a href="/info">Info</a>
      </li>
      <li>
        <a href="/api/persons">People</a>
      </li>
    </ul>
  `)
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} <a href="/api/persons">people</a></p>
    <p>${new Date()}</p>
  `)
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

app.delete('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  const matchId = ({ id }) => id !== personId
  persons = persons.filter(matchId)

  res.status(204).end()
})

const { PORT } = process.env

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
