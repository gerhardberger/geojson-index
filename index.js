const s2 = require('s2')
const normalize = require('geojson-normalize')
const EARTH_RADIUS = 6371

function radius2height (radius) {
  return 1 - Math.sqrt(1 - Math.pow((radius / EARTH_RADIUS), 2))
}

function index (data) {
  const o = normalize(data)

  if (!o || o.features.length === 0) return null

  // for now, only use the first feature in a collection
  const geom = o.features[0].geometry

  // for now, only support `Point` features
  if (geom.type !== 'Point') return null

  const ll = new s2.S2LatLng(geom.coordinates[0], geom.coordinates[1])
  const id = new s2.S2CellId(ll.normalized())

  return id.toString()
}

function cover ({ data, radius = 1000 }, callback) {
  // if (!(callback && typeof callback === 'function')) callback = () => {}
  const handler = (resolve, reject) => {
    const o = normalize(data)

    if (!o || o.features.length === 0) {
      const err = new Error('Data object not does not have features')

      if (callback) return callback(err)
      return reject(err)
    }

    // for now, only use the first feature in a collection
    const geom = o.features[0].geometry

    // for now, only support `Point` features
    if (geom.type !== 'Point') {
      const err = new Error('Only `Point` features supported')
      if (callback) return callback(err)
      return reject(err)
    }

    const ll = new s2.S2LatLng(geom.coordinates[0], geom.coordinates[1])
    const cap = new s2.S2Cap(ll.normalized().toPoint(),
      radius2height(radius / 1000))

    s2.getCover(cap, (err, cells) => {
      if (err) {
        if (callback) return callback(err)
        return reject(err)
      }

      const ids = cells.map(c => c.id().toString())

      if (callback) return callback(null, ids)
      resolve(ids)
    })
  }

  if (callback) return handler()
  return new Promise(handler)
}

module.exports = { index, cover }
