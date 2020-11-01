const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('body', req => JSON.stringify(req.body))

app.use(express.json())
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

const generateId = () => {
  const min = (
    !persons.length
      ? 0
      : Math.max(...persons.map(({ id }) => id))
  ) + 1
  const max = 1000
  let newId = null

  do {
    newId = Math.floor(Math.random() * (max - min + 1)) + min
  } while (persons.find(({ id }) => id === newId))

  return newId
}

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

app.get('/api/persons', (req, res) => res.json(persons))

app.get('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  const matchId = ({ id }) => id === personId
  const person = persons.find(matchId)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const { body } = req

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Both name and number required'
    })
  }

  const matchName = ({ name }) => name === body.name

  const existing = persons.find(matchName)

  if (existing) {
    return res.status(400).json({
      error: 'Duplicated person name'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  const matchId = ({ id }) => id !== personId
  persons = persons.filter(matchId)

  res.status(204).end()
})

const PORT = 3001

app.listen(3001, () => {
  console.log(`Server is running on port ${PORT}`)
})
