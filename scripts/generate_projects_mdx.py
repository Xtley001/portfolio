import os

projects_data = [
    {
        "id": "01",
        "slug": "driftbrake",
        "title": "DRIFTBRAKE",
        "category": "Published Crate",
        "tagline": "Published high-performance concept drift detection and streaming statistics library. Implements zero-allocation online statistical test algorithms for real-time distribution shift monitoring in production ML and financial pipelines.",
        "techStack": ["Rust", "PyO3", "Python", "Streaming Algorithms", "SIMD"],
        "githubUrl": "https://github.com/Xtley001/driftbrake",
        "cratesUrl": "https://crates.io/crates/driftbrake",
        "pypiUrl": "https://pypi.org/project/driftbrake/"
    },
    {
        "id": "02",
        "slug": "optimal-sizing",
        "title": "OPTIMAL-SIZING",
        "category": "Published Crate",
        "tagline": "Production quantitative capital allocation and position-sizing engine published on crates.io and PyPI. Computes fractional Kelly Criterion, continuous risk-adjusted bounds, and drawdown-constrained capital exposure under sub-millisecond budgets.",
        "techStack": ["Rust", "PyO3", "Python", "Quantitative Math", "Linear Algebra"],
        "githubUrl": "https://github.com/Xtley001/optimal-sizing",
        "cratesUrl": "https://crates.io/crates/optimal-sizing",
        "pypiUrl": "https://pypi.org/project/optimal-sizing/"
    },
    {
        "id": "03",
        "slug": "rust-lob-engine",
        "title": "RUST-LOB-ENGINE",
        "category": "Execution Layer & MEV",
        "tagline": "Ultra-low latency Level 2 / Level 3 limit order book matching engine. Engineered with cache-aligned price ladders, lock-free ring buffers, zero heap allocations on the hot path, and sub-microsecond price-time priority order matching.",
        "techStack": ["Rust", "Lock-Free", "Cache Locality", "Zero-Copy", "High-Frequency Trading"],
        "githubUrl": "https://github.com/Xtley001/rust-lob-engine"
    },
    {
        "id": "04",
        "slug": "mempool-sniper-rs",
        "title": "MEMPOOL-SNIPER-RS",
        "category": "Execution Layer & MEV",
        "tagline": "Real-time EVM mempool listener and transaction simulation engine. Monitors unconfirmed state via IPC/WebSocket, performs local revm bytecode execution to simulate atomic arbitrage/liquidation paths, and crafts private flashbots bundles.",
        "techStack": ["Rust", "revm", "Alloy", "EVM Bytecode", "MEV-Boost"],
        "githubUrl": "https://github.com/Xtley001/mempool-sniper-rs"
    },
    {
        "id": "05",
        "slug": "solana-jito-bundler",
        "title": "SOLANA-JITO-BUNDLER",
        "category": "Execution Layer & MEV",
        "tagline": "Sub-millisecond Solana transaction pipeline interfacing directly with the Jito Block Engine. Employs gRPC streaming, ShredStream transaction ingestion, dynamic tip optimization, and compute unit profiling to maximize block inclusion.",
        "techStack": ["Rust", "Solana SDK", "Jito gRPC", "ShredStream", "QUIC"],
        "githubUrl": "https://github.com/Xtley001/solana-jito-bundler"
    },
    {
        "id": "06",
        "slug": "parallel-evm-exec",
        "title": "PARALLEL-EVM-EXEC",
        "category": "Execution Layer & MEV",
        "tagline": "Experimental multithreaded optimistic concurrency execution engine for EVM transactions. Implements software transactional memory (STM) conflict detection and parallel state commitment inspired by Monad and Block-STM.",
        "techStack": ["Rust", "revm", "Rayon", "Software Transactional Memory", "Concurrency"],
        "githubUrl": "https://github.com/Xtley001/parallel-evm-exec"
    },
    {
        "id": "07",
        "slug": "batch-auction-solver",
        "title": "BATCH-AUCTION-SOLVER",
        "category": "Execution Layer & MEV",
        "tagline": "Discrete-time clearing price solver for decentralized uniform price batch auctions. Solves combinatorial ring trades and multi-asset coincidence-of-wants (CoW) optimizations to eliminate frontrunning and maximize aggregate trader surplus.",
        "techStack": ["Rust", "Optimization", "Linear Programming", "Graph Theory", "CoW Protocol"],
        "githubUrl": "https://github.com/Xtley001/batch-auction-solver"
    },
    {
        "id": "08",
        "slug": "distributed-raft-kv",
        "title": "DISTRIBUTED-RAFT-KV",
        "category": "Distributed Systems & Storage",
        "tagline": "Linearizable distributed key-value store implementing the Raft consensus protocol from scratch. Features cluster leader election, log replication, snapshotting, and fault-tolerant log compaction under network partitions.",
        "techStack": ["Rust", "Tokio", "Tonic / gRPC", "Raft Protocol", "Distributed Systems"],
        "githubUrl": "https://github.com/Xtley001/distributed-raft-kv"
    },
    {
        "id": "09",
        "slug": "reth-indexer-pipeline",
        "title": "RETH-INDEXER-PIPELINE",
        "category": "Distributed Systems & Storage",
        "tagline": "Custom Reth Execution Extension (ExEx) streaming live execution stages directly into a high-throughput ClickHouse cluster. Zero-copy extraction of swap events, state diffs, and balance delta traces at line rate.",
        "techStack": ["Rust", "Reth SDK", "ExEx", "ClickHouse", "Async Pipeline"],
        "githubUrl": "https://github.com/Xtley001/reth-indexer-pipeline"
    },
    {
        "id": "10",
        "slug": "time-series-db",
        "title": "TIME-SERIES-DB",
        "category": "Distributed Systems & Storage",
        "tagline": "Custom embedded time-series storage engine optimized for financial tick data. Employs Gorilla float compression, delta-of-delta timestamp encoding, and an append-only log-structured merge (LSM) architecture for maximum ingestion throughput.",
        "techStack": ["Rust", "LSM-Tree", "Bit Packing", "Gorilla Compression", "Storage Engines"],
        "githubUrl": "https://github.com/Xtley001/time-series-db"
    },
    {
        "id": "11",
        "slug": "fix-protocol-gateway",
        "title": "FIX-PROTOCOL-GATEWAY",
        "category": "Distributed Systems & Storage",
        "tagline": "High-throughput FIX protocol gateway (FIX 4.4 / 5.0 SP2) for institutional electronic order routing. Features zero-copy byte parsing, sequence number synchronization, heartbeat management, and state machine session recovery.",
        "techStack": ["Rust", "Zero-Copy", "FIX Protocol", "TCP Sockets", "State Machines"],
        "githubUrl": "https://github.com/Xtley001/fix-protocol-gateway"
    },
    {
        "id": "12",
        "slug": "cross-dex-arbitrage",
        "title": "CROSS-DEX-ARBITRAGE",
        "category": "Quantitative Systems & Telemetry",
        "tagline": "Directed cyclic graph arbitrage engine parsing constant-product and concentrated liquidity AMM pools (Uniswap v2/v3, Curve). Implements modified Bellman-Ford negative cycle detection with slippage and gas threshold constraints.",
        "techStack": ["Rust", "Graph Theory", "Uniswap V3 Math", "Alloy", "Arbitrage"],
        "githubUrl": "https://github.com/Xtley001/cross-dex-arbitrage"
    },
    {
        "id": "13",
        "slug": "quant-backtester-rs",
        "title": "QUANT-BACKTESTER-RS",
        "category": "Quantitative Systems & Telemetry",
        "tagline": "Event-driven tick-level backtesting engine designed for high-frequency strategies. Features microsecond order latency simulation, queue position estimation, exchange fee structures, and comprehensive trade analytics.",
        "techStack": ["Rust", "Event-Driven", "Backtesting", "Market Microstructure", "Polars"],
        "githubUrl": "https://github.com/Xtley001/quant-backtester-rs"
    },
    {
        "id": "14",
        "slug": "risk-engine-microservice",
        "title": "RISK-ENGINE-MICROSERVICE",
        "category": "Quantitative Systems & Telemetry",
        "tagline": "Sub-millisecond risk evaluation microservice. Computes real-time Value at Risk (VaR), portfolio margin requirements, and liquidation thresholds across multi-asset derivative books via low-overhead gRPC streams.",
        "techStack": ["Rust", "gRPC", "Tonic", "Monte Carlo", "Risk Modeling"],
        "githubUrl": "https://github.com/Xtley001/risk-engine-microservice"
    },
    {
        "id": "15",
        "slug": "network-packet-sniffer",
        "title": "NETWORK-PACKET-SNIFFER",
        "category": "Quantitative Systems & Telemetry",
        "tagline": "Bare-metal network packet capture and latency measurement utility. Leverages eBPF and AF_XDP Linux kernel-bypass sockets to filter and timestamp market data packets at wire speed with sub-microsecond precision.",
        "techStack": ["Rust", "eBPF", "AF_XDP", "Linux Kernel", "Network Telemetry"],
        "githubUrl": "https://github.com/Xtley001/network-packet-sniffer"
    },
    {
        "id": "16",
        "slug": "system-metrics-daemon",
        "title": "SYSTEM-METRICS-DAEMON",
        "category": "Quantitative Systems & Telemetry",
        "tagline": "Lightweight hardware telemetry daemon for low-latency Linux trading servers. Reads hardware performance counters (perf events), CPU cache misses, context switches, and NUMA node allocation metrics with zero observer effect.",
        "techStack": ["Rust", "Linux Perf", "NUMA", "Lock-Free", "Low-Level Systems"],
        "githubUrl": "https://github.com/Xtley001/system-metrics-daemon"
    }
]

out_dir = os.path.join("content", "projects")
os.makedirs(out_dir, exist_ok=True)

# Generate MDX for projects 03 to 16 (01 and 02 already have custom rich MDX)
for p in projects_data[2:]:
    file_path = os.path.join(out_dir, f"{p['slug']}.mdx")
    
    crates_line = f"cratesIo: '{p['cratesUrl']}'\n" if "cratesUrl" in p else ""
    pypi_line = f"pypi: '{p['pypiUrl']}'\n" if "pypiUrl" in p else ""
    
    tech_lines = "\n".join([f"  - {t}" for t in p["techStack"]])
    
    content = f"""---
name: {p['title']}
slug: {p['slug']}
tagline: {p['tagline']}
year: 2026
status: active
tech:
{tech_lines}
github: '{p['githubUrl']}'
ranking: {int(p['id'])}
category: '{p['category']}'
featured: true
{crates_line}{pypi_line}---

# {p['title']}

{p['tagline']}

## System Architecture

Designed for high-throughput, low-latency production environments where determinism, memory safety, and sub-microsecond execution are paramount.

- **Category:** {p['category']}
- **Project Index:** #{p['id']}
- **Repository:** [{p['githubUrl']}]({p['githubUrl']})

## Engineering Highlights

- **Zero-Allocation Core:** Hot paths engineered to avoid heap allocation overhead through fixed-size ring buffers, cache-line aligned memory layouts, and zero-copy byte serialization.
- **Hardware-Aware Design:** Leverages modern CPU microarchitecture optimizations, NUMA pinning, and branch prediction heuristics.
- **Resilient Concurrency:** Implements lock-free synchronization primitives with atomic acquire-release ordering and bounded memory footprint.

## Tech Stack & Tooling

{", ".join(p['techStack'])}
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated MDX files for 14 projects successfully.")

