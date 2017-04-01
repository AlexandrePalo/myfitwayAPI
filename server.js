import express from 'express'
import graphqlHTTP from 'express-graphql'
import Schema from './schema'

// config
const APP_PORT = 3000

const app = express()

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}))

app.listen(APP_PORT, () => console.log('App listening on port ' & APP_PORT))
