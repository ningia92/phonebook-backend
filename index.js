const express = require('express')
const morgan = require('morgan')

const app = express()
// static middleware used to make Express show static content, index.html and JS
app.use(express.static('dist'))

// morgan middleware
morgan.token('person', function (req, res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

// json-parser middleware
app.use(express.json())

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    response.send(
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    person
        ? response.json(person)
        : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).send({
            error: 'missing name or number'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).send({
            error: 'name must be unique'
        })
    }

    const person = {
        id: String(Math.random() * 100000),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)

})

// middleware to handle invalid endpoint request
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
