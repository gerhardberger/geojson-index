const test = require('ava')
const geo = require('../')

test.beforeEach(t => {
  t.context = {
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [ 34.0908829, -118.3856206 ]
      },
      properties: { artist: 'Jimi Hendrix' }
    }
  }
})

test('create index', t => {
  t.is(geo.index(t.context.data), '4/001201113311013123011021000230')
})

test('create index wrong data format', t => {
  t.is(geo.index({ foo: 'bar' }), null)
})

test.cb('query callback', t => {
  geo.cover({
    data: t.context.data,
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
    data: t.context.data,
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
