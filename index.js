require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

//app.use(express.static('build'))
app.use(cors())
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

// get all entries
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            response.send(error.message)
        })
})

// get a specific entry
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if ( person ) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// create a new entry
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    
    newPerson.save()
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

// update a specific entry
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
      name: body.name,
      number: body.number
    }
    
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch(error => next(error))
})

// delete a specific entry
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// get number of entries and current time
app.get('/info', (request, response) => {
    Person.find({})
        .then(result => {
            const info = `Phonebook has info for ${result.length} people`
            const time = (new Date()).toString()
            const content = `<p>${info}</p><p>${time}</p>`
            response.send(content)
        })
        .catch(error => {
            response.send(error.message)
        })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.name)
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(500).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})