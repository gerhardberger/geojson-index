# geojson-index

[![Build Status](https://travis-ci.org/gerhardberger/geojson-index.svg?branch=master)](https://travis-ci.org/gerhardberger/geojson-index) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Create index a GeoJSON object's feature and for a query based on a GeoJSON
object's feature. For creating an index **only `Point` feature** is supported.
To cover simple, arbitrary areas the **supported features are `Point` and
`Polygon`.**

This library uses [S2](https://github.com/mapbox/node-s2), which means an index
for a more specific position is longer and has the same prefix as a position
that is bigger, but contains that area, so they are an ideal fit for database
indices. Also S2 creates tiles and with these tiles it can cover areas, but
these each tile has its own index, that's why the `cover` method returns an
array of indices.

``` js
const geo = require('geojson-index')

const foo = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [ 34.0908829, -118.3856206 ]
  },
  properties: { bar: 'baz' }
}

console.log('Index for this position:', geo.index(foo))

geo.cover({
  data: foo,
  radius: 100
}).then(ixs => {
  console.log('Indices for this query:', ixs)
}).catch(err => console.error(err))
```

## install

```
$ npm i geojson-index
```

## usage

#### `geo.index(data)`

Takes an `Object`, that is a proper GeoJSON object or GeoJSON feature that can
be converted to one. **Returns** a `String` that is the index for this feature.

#### `geo.cover(options[, callback])`

`options`
- `data` Object: a proper GeoJSON object or GeoJSON feature that can be
  converted to one
- `radius` Number: the radius in **meters**, which the indices should cover.

**Returns** a `Promise` or calls a `callback` if specified with the result
`Array` of index pairs. A pair is an object with a `gte`, and `lt` value, which
means the indices in that area are *greater than or equal to* `gte` and *lower
than* `lt`.

## test

```
$ npm test
```
