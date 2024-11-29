# @ip-lookup/country

[![npm version](https://badge.fury.io/js/%40ip-lookup%2Fcountry.svg)](https://badge.fury.io/js/%40ip-lookup%2Fcountry)
[![Downloads](https://img.shields.io/npm/dm/%40ip-lookup%2Fcountry.svg)](https://www.npmjs.com/package/%40ip-lookup%2Fcountry)
[![Build](https://github.com/ip-lookup/ip-lookup/actions/workflows/build.yml/badge.svg)](https://github.com/ip-lookup/ip-lookup/actions/workflows/build.yml)

## Usage

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@ip-lookup/country/dist/index.min.js"></script>
<script type="text/javascript">
  async function run() {
    var ip = '207.97.227.239'
    var location = await IpLookup(ip)
    console.log(location)
    // {
    //   country: 'FR',
    // }
  }
</script>
```

### ESM

```ts
import IpLookup from '@ip-lookup/country'

const location = await IpLookup('207.97.227.239')
```

### CommonJS

```ts
const IpLookup = require('@ip-lookup/country')

const location = await IpLookup('207.97.227.239')
```
