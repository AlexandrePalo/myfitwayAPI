import Sequelize from 'sequelize'
import faker from 'faker'

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
const Track = Conn.define('track', {
  title: { type: Sequelize.STRING, allowNull: false },
  distance: { type: Sequelize.DOUBLE },
  place: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING }
})
const Category = Conn.define('category', {
  code: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false }
})

// Relationships
Track.belongsTo(Category)
Category.hasMany(Track)

// Populate
Conn.sync({ force: true }).then(() => {
  [
    { code: 'vtt', name: 'VTT XC' },
    { code: 'biking', name: 'Cyclisme' },
    { code: 'hiking', name: 'Randonnée' },
    { code: 'motorbike', name: 'Enduro' },
    { code: 'footing', name: 'Footing' }
  ].forEach((cat) => {
    Category.create({
      code: cat.code,
      name: cat.name
    }).then((category) => {
      return category.createTrack({
        title: faker.lorem.words(),
        distance: faker.random.number(),
        place: faker.address.city(),
        description: faker.lorem.sentences()
      })
    })
  })
})

export default Conn
