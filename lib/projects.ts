import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type ProjectCategory =
  | "Published Crate"
  | "Execution Layer & MEV"
  | "Distributed Systems & Storage"
  | "Quantitative Systems & Telemetry";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  techStack: string[];
  githubUrl?: string;
  cratesUrl?: string;
  pypiUrl?: string;

  // Compatibility fields for existing renderers
  slug?: string;
  name?: string;
  tagline?: string;
  tech?: string[];
  year?: number;
  status?: 'active' | 'completed' | 'archived' | 'stealth';
  github?: string;
  live?: string;
  image?: string;
  featured?: boolean;
  content?: string;
  ranking?: number;
  stats?: string;
  docs?: string;
  cratesIo?: string;
  pypi?: string;
  book?: string;
}

export const projects: Project[] = [
  // TIER 1: FLAGSHIP PUBLISHED CRATES
  {
    id: "01",
    title: "DRIFTBRAKE",
    category: "Published Crate",
    description: "Published high-performance concept drift detection and streaming statistics library. Implements zero-allocation online statistical test algorithms for real-time distribution shift monitoring in production ML and financial pipelines.",
    techStack: ["Rust", "PyO3", "Python", "Streaming Algorithms", "SIMD"],
    githubUrl: "https://github.com/Xtley001/driftbrake",
    cratesUrl: "https://crates.io/crates/driftbrake",
    pypiUrl: "https://pypi.org/project/driftbrake/"
  },
  {
    id: "02",
    title: "OPTIMAL-SIZING",
    category: "Published Crate",
    description: "Production quantitative capital allocation and position-sizing engine published on crates.io and PyPI. Computes fractional Kelly Criterion, continuous risk-adjusted bounds, and drawdown-constrained capital exposure under sub-millisecond budgets.",
    techStack: ["Rust", "PyO3", "Python", "Quantitative Math", "Linear Algebra"],
    githubUrl: "https://github.com/Xtley001/optimal-sizing",
    cratesUrl: "https://crates.io/crates/optimal-sizing",
    pypiUrl: "https://pypi.org/project/optimal-sizing/"
  },

  // TIER 2: EXECUTION LAYER, ORDER BOOKS & MEV
  {
    id: "03",
    title: "RUST-LOB-ENGINE",
    category: "Execution Layer & MEV",
    description: "Ultra-low latency Level 2 / Level 3 limit order book matching engine. Engineered with cache-aligned price ladders, lock-free ring buffers, zero heap allocations on the hot path, and sub-microsecond price-time priority order matching.",
    techStack: ["Rust", "Lock-Free", "Cache Locality", "Zero-Copy", "High-Frequency Trading"],
    githubUrl: "https://github.com/Xtley001/rust-lob-engine"
  },
  {
    id: "04",
    title: "MEMPOOL-SNIPER-RS",
    category: "Execution Layer & MEV",
    description: "Real-time EVM mempool listener and transaction simulation engine. Monitors unconfirmed state via IPC/WebSocket, performs local revm bytecode execution to simulate atomic arbitrage/liquidation paths, and crafts private flashbots bundles.",
    techStack: ["Rust", "revm", "Alloy", "EVM Bytecode", "MEV-Boost"],
    githubUrl: "https://github.com/Xtley001/mempool-sniper-rs"
  },
  {
    id: "05",
    title: "SOLANA-JITO-BUNDLER",
    category: "Execution Layer & MEV",
    description: "Sub-millisecond Solana transaction pipeline interfacing directly with the Jito Block Engine. Employs gRPC streaming, ShredStream transaction ingestion, dynamic tip optimization, and compute unit profiling to maximize block inclusion.",
    techStack: ["Rust", "Solana SDK", "Jito gRPC", "ShredStream", "QUIC"],
    githubUrl: "https://github.com/Xtley001/solana-jito-bundler"
  },
  {
    id: "06",
    title: "PARALLEL-EVM-EXEC",
    category: "Execution Layer & MEV",
    description: "Experimental multithreaded optimistic concurrency execution engine for EVM transactions. Implements software transactional memory (STM) conflict detection and parallel state commitment inspired by Monad and Block-STM.",
    techStack: ["Rust", "revm", "Rayon", "Software Transactional Memory", "Concurrency"],
    githubUrl: "https://github.com/Xtley001/parallel-evm-exec"
  },
  {
    id: "07",
    title: "BATCH-AUCTION-SOLVER",
    category: "Execution Layer & MEV",
    description: "Discrete-time clearing price solver for decentralized uniform price batch auctions. Solves combinatorial ring trades and multi-asset coincidence-of-wants (CoW) optimizations to eliminate frontrunning and maximize aggregate trader surplus.",
    techStack: ["Rust", "Optimization", "Linear Programming", "Graph Theory", "CoW Protocol"],
    githubUrl: "https://github.com/Xtley001/batch-auction-solver"
  },

  // TIER 3: DISTRIBUTED SYSTEMS & STORAGE
  {
    id: "08",
    title: "DISTRIBUTED-RAFT-KV",
    category: "Distributed Systems & Storage",
    description: "Linearizable distributed key-value store implementing the Raft consensus protocol from scratch. Features cluster leader election, log replication, snapshotting, and fault-tolerant log compaction under network partitions.",
    techStack: ["Rust", "Tokio", "Tonic / gRPC", "Raft Protocol", "Distributed Systems"],
    githubUrl: "https://github.com/Xtley001/distributed-raft-kv"
  },
  {
    id: "09",
    title: "RETH-INDEXER-PIPELINE",
    category: "Distributed Systems & Storage",
    description: "Custom Reth Execution Extension (ExEx) streaming live execution stages directly into a high-throughput ClickHouse cluster. Zero-copy extraction of swap events, state diffs, and balance delta traces at line rate.",
    techStack: ["Rust", "Reth SDK", "ExEx", "ClickHouse", "Async Pipeline"],
    githubUrl: "https://github.com/Xtley001/reth-indexer-pipeline"
  },
  {
    id: "10",
    title: "TIME-SERIES-DB",
    category: "Distributed Systems & Storage",
    description: "Custom embedded time-series storage engine optimized for financial tick data. Employs Gorilla float compression, delta-of-delta timestamp encoding, and an append-only log-structured merge (LSM) architecture for maximum ingestion throughput.",
    techStack: ["Rust", "LSM-Tree", "Bit Packing", "Gorilla Compression", "Storage Engines"],
    githubUrl: "https://github.com/Xtley001/time-series-db"
  },
  {
    id: "11",
    title: "FIX-PROTOCOL-GATEWAY",
    category: "Distributed Systems & Storage",
    description: "High-throughput FIX protocol gateway (FIX 4.4 / 5.0 SP2) for institutional electronic order routing. Features zero-copy byte parsing, sequence number synchronization, heartbeat management, and state machine session recovery.",
    techStack: ["Rust", "Zero-Copy", "FIX Protocol", "TCP Sockets", "State Machines"],
    githubUrl: "https://github.com/Xtley001/fix-protocol-gateway"
  },

  // TIER 4: QUANTITATIVE SYSTEMS & TELEMETRY
  {
    id: "12",
    title: "CROSS-DEX-ARBITRAGE",
    category: "Quantitative Systems & Telemetry",
    description: "Directed cyclic graph arbitrage engine parsing constant-product and concentrated liquidity AMM pools (Uniswap v2/v3, Curve). Implements modified Bellman-Ford negative cycle detection with slippage and gas threshold constraints.",
    techStack: ["Rust", "Graph Theory", "Uniswap V3 Math", "Alloy", "Arbitrage"],
    githubUrl: "https://github.com/Xtley001/cross-dex-arbitrage"
  },
  {
    id: "13",
    title: "QUANT-BACKTESTER-RS",
    category: "Quantitative Systems & Telemetry",
    description: "Event-driven tick-level backtesting engine designed for high-frequency strategies. Features microsecond order latency simulation, queue position estimation, exchange fee structures, and comprehensive trade analytics.",
    techStack: ["Rust", "Event-Driven", "Backtesting", "Market Microstructure", "Polars"],
    githubUrl: "https://github.com/Xtley001/quant-backtester-rs"
  },
  {
    id: "14",
    title: "RISK-ENGINE-MICROSERVICE",
    category: "Quantitative Systems & Telemetry",
    description: "Sub-millisecond risk evaluation microservice. Computes real-time Value at Risk (VaR), portfolio margin requirements, and liquidation thresholds across multi-asset derivative books via low-overhead gRPC streams.",
    techStack: ["Rust", "gRPC", "Tonic", "Monte Carlo", "Risk Modeling"],
    githubUrl: "https://github.com/Xtley001/risk-engine-microservice"
  },
  {
    id: "15",
    title: "NETWORK-PACKET-SNIFFER",
    category: "Quantitative Systems & Telemetry",
    description: "Bare-metal network packet capture and latency measurement utility. Leverages eBPF and AF_XDP Linux kernel-bypass sockets to filter and timestamp market data packets at wire speed with sub-microsecond precision.",
    techStack: ["Rust", "eBPF", "AF_XDP", "Linux Kernel", "Network Telemetry"],
    githubUrl: "https://github.com/Xtley001/network-packet-sniffer"
  },
  {
    id: "16",
    title: "SYSTEM-METRICS-DAEMON",
    category: "Quantitative Systems & Telemetry",
    description: "Lightweight hardware telemetry daemon for low-latency Linux trading servers. Reads hardware performance counters (perf events), CPU cache misses, context switches, and NUMA node allocation metrics with zero observer effect.",
    techStack: ["Rust", "Linux Perf", "NUMA", "Lock-Free", "Low-Level Systems"],
    githubUrl: "https://github.com/Xtley001/system-metrics-daemon"
  }
];

const projectsDir = path.join(process.cwd(), 'content', 'projects')

export function getAllProjects(): Project[] {
  return projects.map(p => {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const filePath = path.join(projectsDir, `${slug}.mdx`)
    let content = ''
    let mdxData: Record<string, any> = {}

    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8')
        const parsed = matter(raw)
        content = parsed.content
        mdxData = parsed.data
      } catch {
        // ignore
      }
    }

    return {
      ...p,
      slug,
      name: p.title,
      tagline: p.description,
      tech: p.techStack,
      ranking: parseInt(p.id, 10),
      year: mdxData.year || 2026,
      status: mdxData.status || 'active',
      github: p.githubUrl || '',
      live: p.cratesUrl || p.pypiUrl || '',
      image: mdxData.image || '',
      featured: true,
      content,
      cratesIo: p.cratesUrl || mdxData.cratesIo || '',
      pypi: p.pypiUrl || mdxData.pypi || '',
      docs: mdxData.docs || '',
      book: mdxData.book || '',
    }
  }).sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10))
}

export function getProjectBySlug(slug: string): Project | null {
  const all = getAllProjects()
  const found = all.find(p => p.slug === slug || p.id === slug || p.title.toLowerCase() === slug.toLowerCase())
  return found || null
}
