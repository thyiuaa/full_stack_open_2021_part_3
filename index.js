const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
    // console.log(tokens.method(req, res), typeof tokens.method(req, res));
    // console.log(tokens.status(req, res), typeof tokens.status(req, res));
    if ( (tokens.method(req, res) === 'POST') && (tokens.status(req, res) === '200') ) {
        console.log('true');
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
        ].join(' ')
    }
}))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const maxId = () => {
    return notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
}

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((person => person.id === id))
    if ( person ) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const info = `Phonebook has info for ${persons.length} people`
    const time = (new Date()).toString()
    const content = `<p>${info}</p><p>${time}</p>`
    response.send(content)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if ( !body.name || !body.number ) {
        return response
            .status(400)
            .json({ error: 'name or number missing' })
    }

    if ( persons.find(person => person.name === body.name) ) {
        return response
            .status(400)
            .json({ error: 'name must be unique' })
    }

    let newId = Math.floor(Math.random() * 5000)
    while (persons.find(person => person.id === newId)) {
        newId = Math.floor(Math.random() * 5000)
    }

    const newPerson = {
        id: newId,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personDelete = persons.find((person => person.id === id))
    if ( personDelete ) {
        persons = persons.filter(person => person.id != personDelete.id)
        console.log(`perons.length after deletion: ${persons.length}`)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

const PORT = process.env.PORT||3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})