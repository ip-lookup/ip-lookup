# IP Location Database System Documentation

## Overview

The system processes geographical IP data from either MaxMind's GeoLite2 or DB-IP databases into an optimized binary format for efficient lookups. The process involves several steps from downloading to final optimization.

## Database Sources

The system supports two main data sources:

- MaxMind GeoLite2: Licensed under CC BY-SA 4.0, requires attribution

## Update Process

### 1. Initial Verification

```ts
async function update(inputSettings?: Partial<IpLocationApiInputSettings>) {
  const settings = getSettings(inputSettings)
  await ensureDirectoriesExist(settings)
}
```

- Initializes settings with user overrides
- Creates necessary directories for temporary and final data

### 2. Database Download & Verification

```ts
const { files, sha256 } = await downloadAndExtractDatabase(settings)
```

#### 2.1. SHA256 Verification

- Downloads SHA256 hash from provider
- Checks if local database exists and matches remote hash
- If hashes match and ZIP exists locally, skips download

#### 2.2. Database Download

- Downloads ZIP file if needed
- Extracts specific CSV files:
  - Location data (with optional language variants)
  - IPv4 blocks
  - IPv6 blocks

### 3. Data Processing

#### 3.1. Location Data Processing

```ts
const locationData: Record<number, LocationData | string>[] = []
for (const locationSource of locationSources) {
  locationData.push(await getLocationData(locationSource, settings))
}
```

- Processes location CSV files
- Creates mappings of location IDs to their metadata
- Handles multiple languages if specified

#### 3.2. Block Data Processing

For each IP version (v4 and v6):

- Reads block CSV files
- Converts IP ranges to numeric format
- Merges consecutive ranges with identical metadata
- Creates binary buffer structures:

```ts
const v4Buf1 = Buffer.alloc(v4.length * 4) // Start IPs
const v4Buf2 = Buffer.alloc(v4.length * 4) // End IPs
const v4Buf3 = Buffer.alloc(v4.length * 8) // Metadata
```

### 4. Storage Optimization

#### 4.1. Standard Memory Mode

- Creates three main data files per IP version:
  - `{version}-1.dat`: Start IP addresses
  - `{version}-2.dat`: End IP addresses
  - `{version}-3.dat`: Associated metadata

#### 4.2. Small Memory Mode

```ts
if (settings.smallMemory) {
  const [dir, file, offset] = getSmallMemoryFile(lineCount, db)
  // Splits data into smaller chunks
}
```

- Splits data into smaller files for memory-efficient processing
- Creates directory structure: `v{version}/_X/_Y`
- Each file contains a fixed number of records

### 5. Index Creation (Browser Version)

```ts
async function createBrowserIndex(type: 'country' | 'geocode', ...) {
    const indexSize = type === 'country' ? 1024 : 2048
    // Creates index files for efficient binary search
}
```

- Creates index files for browser-based lookups
- Generates fixed-size lookup tables
- Optimizes for different use cases (country vs. geocode)

### 6. Finalization

```ts
// Rename temporary files to final names
for (const file of tmpFiles) {
  await rename(
    path.join(settings.fieldDir, file),
    path.join(settings.fieldDir, file.replace('.tmp', ''))
  )
}
```

- Moves temporary files to final locations
- Updates SHA256 hash file
- Cleans up temporary directories

## File Structure

### Standard Memory Mode Structure

```
fieldDir/
├── 4-1.dat      # IPv4 start addresses
├── 4-2.dat      # IPv4 end addresses
├── 4-3.dat      # IPv4 metadata
├── 6-1.dat      # IPv6 start addresses
├── 6-2.dat      # IPv6 end addresses
├── 6-3.dat      # IPv6 metadata
├── location.dat # Location metadata
├── name.dat     # City names
└── sub.json     # Additional data (regions, timezones)
```

### Small Memory Mode Structure

```
fieldDir/
├── v4/
│   ├── _0/
│   │   ├── _0
│   │   ├── _1
│   │   └── ...
│   ├── _1/
│   └── ...
└── v6/
    └── ...
```

### Browser Index Structure

Browser Index Structure

```
exportDir/
├── 4.idx        # IPv4 index file
├── 6.idx        # IPv6 index file
├── 4/           # IPv4 data chunks
└── 6/           # IPv6 data chunks
```

## Binary Data Format

### IP Address Records

- Start IP: 4 bytes (IPv4) or 16 bytes (IPv6)
- End IP: 4 bytes (IPv4) or 16 bytes (IPv6)
- Metadata pointer: 8 bytes

### Location Records

- Fixed-length records
- Indexed by metadata pointer
- Contains configurable fields (country, region, city, etc.)

### Index Files

- Fixed-size lookup tables
- Optimized for binary search
- Separate indices for IPv4 and IPv6

This structure provides efficient IP location lookups while maintaining flexibility for different deployment scenarios and memory constraints.
