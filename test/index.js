const test = require('ava')
const geo = require('../')

test.beforeEach(t => {
  t.context = {
    pt: {
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [ 34.0908829, -118.3856206 ]
        },
        properties: { artist: 'Jimi Hendrix' }
      }
    },
    poly: {
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [ 16.336669921875, 48.019324184801185 ],
            [ 20.555419921875, 48.596592251456705 ],
            [ 22.82958984375, 48.09275716032736 ],
            [ 20.841064453125, 46.14939437647686 ],
            [ 17.75390625, 45.79050946752472 ],
            [ 16.204833984375, 46.78501604269254 ]
          ]]
        },
        properties: { artist: 'Nina Simone' }
      }
    }
  }
})

test('create index', t => {
  t.is(geo.index(t.context.pt.data), '4/001201113311013123011021000230')
})

test('create index wrong data format', t => {
  t.is(geo.index({ foo: 'bar' }), null)
})

test.cb('query callback', t => {
  geo.cover({
    data: t.context.pt.data,
    radius: 1940
  }, (err, ixs) => {
    if (err) throw err
    t.deepEqual(ixs, [ { gte: '4/0012011130221', lt: '4/0012011130222' },
      { gte: '4/00120111302221', lt: '4/00120111302222' },
      { gte: '4/001201113200', lt: '4/001201113201' },
      { gte: '4/001201113201', lt: '4/001201113202' },
      { gte: '4/001201113310', lt: '4/001201113311' },
      { gte: '4/001201113311', lt: '4/001201113312' },
      { gte: '4/001201113312', lt: '4/001201113313' },
      { gte: '4/00120111331311', lt: '4/00120111331312' } ])

    t.end()
  })
})

test('query promise', t => {
  return geo.cover({
    data: t.context.pt.data,
    radius: 1940
  }).then(ixs => {
    t.deepEqual(ixs, [ { gte: '4/0012011130221', lt: '4/0012011130222' },
      { gte: '4/00120111302221', lt: '4/00120111302222' },
      { gte: '4/001201113200', lt: '4/001201113201' },
      { gte: '4/001201113201', lt: '4/001201113202' },
      { gte: '4/001201113310', lt: '4/001201113311' },
      { gte: '4/001201113311', lt: '4/001201113312' },
      { gte: '4/001201113312', lt: '4/001201113313' },
      { gte: '4/00120111331311', lt: '4/00120111331312' } ])
  })
})

test.cb('query callback wrong data format', t => {
  geo.cover({
    data: { foo: 'bar' },
    radius: 1940
  }, (err, ixs) => {
    t.throws(() => {
      if (err) throw err
    }, 'Data object not does not have features')
    t.end()
  })
})

test('query promise wrong data format', t => {
  return geo.cover({
    data: { foo: 'bar' },
    radius: 1940
  }).catch(err => {
    t.throws(() => {
      if (err) throw err
    }, 'Data object not does not have features')
  })
})

test('polygon cover promise', t => {
  return geo.cover({
    data: t.context.poly.data
  }).then(ixs => {
    t.deepEqual(ixs, [ { gte: '1/323301', lt: '1/323302' },
      { gte: '1/323332', lt: '1/323333' },
      { gte: '1/3300', lt: '1/3301' },
      { gte: '1/3301011', lt: '1/3301012' },
      { gte: '1/330132', lt: '1/330133' } ])
  })
})

test.cb('polygon cover callback', t => {
  geo.cover({ data: t.context.poly.data }, (err, ixs) => {
    if (err) throw err
    t.deepEqual(ixs, [ { gte: '1/323301', lt: '1/323302' },
      { gte: '1/323332', lt: '1/323333' },
      { gte: '1/3300', lt: '1/3301' },
      { gte: '1/3301011', lt: '1/3301012' },
      { gte: '1/330132', lt: '1/330133' } ])
    t.end()
  })
})
