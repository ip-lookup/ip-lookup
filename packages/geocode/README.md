# @ip-lookup/geocode

[![npm version](https://badge.fury.io/js/%40ip-lookup%2Fgeocode.svg)](https://badge.fury.io/js/%40ip-lookup%2Fgeocode)
[![Downloads](https://img.shields.io/npm/dm/%40ip-lookup%2Fgeocode.svg)](https://www.npmjs.com/package/%40ip-lookup%2Fgeocode)
[![Build](https://github.com/ip-lookup/ip-lookup/actions/workflows/build.yml/badge.svg)](https://github.com/ip-lookup/ip-lookup/actions/workflows/build.yml)

## Usage

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@ip-lookup/geocode/dist/index.min.js"></script>
<script type="text/javascript">
  async function run() {
    var ip = '207.97.227.239'
    var location = await IpLookup(ip)
    console.log(location)
    // {
    //   country: 'FR',
    //   latitude: 50.9959,
    //   longitude: 2.11757
    // }
  }
</script>
```

### ESM

```ts
import IpLookup from '@ip-lookup/geocode'

const location = await IpLookup('207.97.227.239')
```

### CommonJS

```ts
const IpLookup = require('@ip-lookup/geocode')

const location = await IpLookup('207.97.227.239')
```
