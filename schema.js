import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} from 'graphql'
import Db from './db'

const Category = new GraphQLObjectType({
  name: 'Category',
  description: 'This represents a category of a track.',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(category) {
        return category.id
      }
    },
    code: {
      type: GraphQLString,
      resolve(category) {
        return category.code
      }
    },
    name: {
      type: GraphQLString,
      resolve(category) {
        return category.name
      }
    },
    tracks: {
      type: new GraphQLList(Track),
      resolve(category) {
        return category.getTracks()
      }
    }
  })
})

const Track = new GraphQLObjectType({
  name: 'Track',
  description: 'This represents a track.',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve(track) {
        return track.id
      }
    },
    title: {
      type: GraphQLString,
      resolve(track) {
        return track.title
      }
    },
    distance: {
      type: GraphQLString,
      resolve(track) {
        return track.distance
      }
    },
    place: {
      type: GraphQLString,
      resolve(track) {
        return track.place
      }
    },
    description: {
      type: GraphQLString,
      resolve(track) {
        return track.description
      }
    },
    category: {
      type: Category,
      resolve(track) {
        return track.getCategory()
      }
    }
  })
})

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query.',
  fields: () => ({
    tracks: {
      type: new GraphQLList(Track), // type retourné
      args: { // args de recherche autorisés
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        place: { type: GraphQLString }
      },
      resolve(root, args) { // fonction qui recherche
        return Db.models.track.findAll({ where: args }) // conn. à la db
      }
    },
    categories: {
      type: new GraphQLList(Category),
      args: {
        id: { type: GraphQLInt },
        code: { type: GraphQLString },
        name: { type: GraphQLString }
      },
      resolve(root, args) {
        return Db.models.category.findAll({ where: args })
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query
})

export default Schema
