const s2 = require('@mapbox/s2')
const normalize = require('@mapbox/geojson-normalize')

const EARTH_RADIUS = 6371

function radius2height (radius) {
  return 1 - Math.sqrt(1 - Math.pow((radius / EARTH_RADIUS), 2))
}

function getShape (geom, { radius }) {
  if (geom.type === 'Point') {
    const ll = new s2.S2LatLng(geom.coordinates[0], geom.coordinates[1])

    return new s2.S2Cap(ll.normalized().toPoint(),
      radius2height(radius / 1000))
  }

  // handle `Polygon`
  const lls = geom.coordinates[0].map(
    coord => (new s2.S2LatLng(coord[0], coord[1])).normalized().toPoint())
  return [lls]
}

function index (data) {
  const o = normalize(data)

  if (!o || o.features.length === 0) return null

  // use the first feature in a collection
  const geom = o.features[0].geometry

  // for indexing, only `Point` feature is supported
  if (geom.type !== 'Point') return null

  const ll = new s2.S2LatLng(geom.coordinates[0], geom.coordinates[1])
  const id = new s2.S2CellId(ll.normalized())

  return id.toString()
}

function cover ({ data, radius = 1000, min = 1, max = 30 }, callback) {
  const handler = (resolve, reject) => {
    const o = normalize(data)

    if (!o || o.features.length === 0) {
      const err = new Error('Data object not does not have features')

      if (callback) return callback(err)
      return reject(err)
    }

    // use only the first feature in a collection
    const geom = o.features[0].geometry

    if (geom.type !== 'Point' && geom.type !== 'Polygon') {
      const err = new Error('Only `Point` or `Polygon` features are supported')
      if (callback) return callback(err)
      return reject(err)
    }

    s2.getCover(getShape(geom, { radius }), { min, max }, (err, cells) => {
      if (err) {
        if (callback) return callback(err)
        return reject(err)
      }

      const ids = cells.map(c =>
        ({ gte: c.id().toString(), lt: c.id().next().toString() }))

      if (callback) return callback(null, ids)
      resolve(ids)
    })
  }

  if (callback) return handler()
  return new Promise(handler)
}

module.exports = { index, cover }
