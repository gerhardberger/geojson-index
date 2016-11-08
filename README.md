# geojson-index

[![Build Status](https://travis-ci.org/gerhardberger/geojson-index.svg?branch=master)](https://travis-ci.org/gerhardberger/geojson-index) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Create index a GeoJSON object's feature and for a query based on a GeoJSON
object's feature. Currently only `Point` type supported.

This library uses S2, which means an index for a more specific position is
longer and has the same prefix as a position that is bigger, but contains that
area, so they are an ideal fit for database indexes. Also S2 creates tiles and
with these tiles it can cover areas, but these each tile has its own index,
that's why the `cover` method returns an array of indexes.

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
  console.log('Indexes for this query:', ixs)
}).catch(err => console.error(err))
```

## install

```
$ npm i geojson-index
```

## usage

#### `geo.index(data)`

Takes an `Object`, that is a proper GeoJSON object or GeoJSON feature that can be
converted to one. **Returns** a `String` that is the index for this feature.

#### `geo.cover(options[, callback])`

`options`
- `data` Object: a proper GeoJSON object or GeoJSON feature that can be
  converted to one
- `radius` Number: the radius in **meters**, which the indexes should cover.

**Returns** a `Promise` or calls a `callback` if specified with the result
`Array` of indexes.

#### test

```
$ npm test
```
