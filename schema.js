import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
} from 'graphql'
import GraphQLDate from 'graphql-date'
import moment from 'moment'
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
      type: GraphQLFloat,
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
    },
    addTimestamp: {
      type: GraphQLDate,
      resolve(track) {
        return track.addTimestamp
      }
    },
    downloads: {
      type: GraphQLInt,
      resolve(track) {
        return track.downloads
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
        place: { type: GraphQLString },
        categoryId: { type: GraphQLInt }
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
    },
    category: {
      type: Category,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(root, args) {
        return Db.models.category.find({ where: args })
      }
    },
    track: {
      type: Track,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(root, args) {
        return Db.models.track.find({ where: args })
      }
    },
    newTracks: {
      type: new GraphQLList(Track),
      args: {
        categoryId: { type: GraphQLInt }
      },
      resolve(root, args) {
        return Db.models.track.findAll({
          where: args,
          order: 'addTimestamp DESC',
          limit: 10
        })
      }
    },
    famousTracks: {
      type: new GraphQLList(Track),
      args: {
        categoryId: { type: GraphQLInt }
      },
      resolve(root, args) {
        return Db.models.track.findAll({
          where: args,
          order: 'downloads DESC',
          limit: 10
        })
      }
    }
  })
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root mutation',
  fields: () => ({
    addTrack: {
      type: Track,
      args: {
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        distance: { type: GraphQLFloat },
        place: { type: GraphQLString },
        description: { type: GraphQLString },
        categoryId: { type: GraphQLInt }
      },
      resolve: (root, args) => {
        return Db.models.track.create({
          title: args.title,
          distance: args.distance,
          place: args.place,
          description: args.description,
          addTimestamp: moment(),
          downloads: 0,
          categoryId: args.categoryId
        })
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})

export default Schema
