import Sequelize from 'sequelize'
import faker from 'faker'
import moment from 'moment'

const Conn = new Sequelize(
  'myfitway',
  'root',
  'root',
  {
    dialect: 'mariadb',
    host: 'localhost'
  }
)

// Models
export const TrackDB = Conn.define('track', {
  title: { type: Sequelize.STRING, allowNull: false },
  distance: { type: Sequelize.DOUBLE },
  place: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  addTimestamp: { type: Sequelize.DATE },
  downloads: { type: Sequelize.INTEGER }
})
export const CategoryDB = Conn.define('category', {
  code: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false }
})

// Relationships
TrackDB.belongsTo(CategoryDB)
CategoryDB.hasMany(TrackDB)

// Populate
Conn.sync({ force: true }).then(() => {
  [
    { code: 'vtt', name: 'VTT XC' },
    { code: 'biking', name: 'Cyclisme' },
    { code: 'hiking', name: 'Randonnée' },
    { code: 'motorbike', name: 'Enduro' },
    { code: 'footing', name: 'Footing' }
  ].forEach((cat) => {
    CategoryDB.create({
      code: cat.code,
      name: cat.name
    }).then((category) => {
      return category.createTrack({
        title: faker.lorem.words(),
        distance: faker.random.number(),
        place: faker.address.city(),
        description: faker.lorem.sentences(),
        addTimestamp: moment(),
        downloads: 0
      })
    })
  })
})

export default Conn
