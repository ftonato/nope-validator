# Benchmark Results

**Date:** June 12, 2026  
**Runs:** 10 (averaged)

## Versions

- **nope-validator:** 1.2.1 (local build)
- **yup:** 1.7.1

## Results

```
nopeSync:   361 260 ops/s, ±2.64%  | fastest
yupSync:     36 500 ops/s, ±3.24%  | 89.90% slower
yupAsync:    33 880 ops/s, ±2.22%  | slowest, 90.62% slower
```

**Fastest:** nopeSync  
**Slowest:** yupAsync

## Specs

- MacBook Pro (Mac14,9)
- Apple M2 Pro
- 10 cores (6 performance and 4 efficiency)
- 32 GB RAM
- macOS 26.5
