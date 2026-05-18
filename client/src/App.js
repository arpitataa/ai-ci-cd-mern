import { useEffect, useMemo, useState } from "react"
import axios from "axios"

function Dashboard() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [lastUpdated, setLastUpdated] = useState(null)

  const API_URL = "http://13.206.144.172:5000/api/logs"

  const fetchLogs = async () => {
    try {
      const res = await axios.get(API_URL)

      if (Array.isArray(res.data)) {
        setLogs(res.data)
      } else {
        setLogs([])
      }

      setError("")
      setLastUpdated(new Date())
    } catch (err) {
      console.error(err)
      setError("Unable to fetch pipeline logs. Please check backend/API connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter = filter === "all" || log.status === filter

      const text = `${log.status || ""} ${log.logs || ""} ${log.ai_analysis || ""}`.toLowerCase()
      const matchesSearch = text.includes(search.toLowerCase())

      return matchesFilter && matchesSearch
    })
  }, [logs, search, filter])

  const failedCount = logs.filter((log) => log.status === "failed").length
  const successCount = logs.filter((log) => log.status === "success").length
  const latestRun = logs[0]

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.liveBadge}>
            <span style={styles.liveDot}></span>
            Live Monitoring
          </div>

          <h1 style={styles.title}>AI CI/CD Monitoring Dashboard</h1>

          <p style={styles.subtitle}>
            Real-time CI/CD failure tracking with AI-powered log analysis
          </p>
        </div>

        <button onClick={fetchLogs} style={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>📊 Total Logs</p>
          <h2 style={styles.statValue}>{logs.length}</h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>❌ Failures</p>
          <h2 style={{ ...styles.statValue, color: "#f87171" }}>{failedCount}</h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>✅ Successful</p>
          <h2 style={{ ...styles.statValue, color: "#4ade80" }}>{successCount}</h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>🚀 Latest Run</p>
          <h2
            style={{
              ...styles.statValue,
              color: latestRun?.status === "failed" ? "#f87171" : "#4ade80"
            }}
          >
            {latestRun ? latestRun.status.toUpperCase() : "N/A"}
          </h2>
        </div>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search logs, errors, status or AI analysis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Status</option>
          <option value="failed">Failed</option>
          <option value="success">Success</option>
        </select>
      </div>

      <p style={styles.updatedText}>
        Auto-refreshing every 5 seconds
        {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
      </p>

      {loading && <p style={styles.message}>Loading pipeline logs...</p>}

      {error && <p style={styles.error}>⚠️ {error}</p>}

      {!loading && filteredLogs.length === 0 && (
        <p style={styles.message}>No pipeline logs found.</p>
      )}

      <div style={styles.logsContainer}>
        {filteredLogs.map((log) => (
          <div key={log._id} style={styles.logCard}>
            <div style={styles.cardHeader}>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor:
                    log.status === "failed" ? "#7f1d1d" : "#14532d",
                  color: log.status === "failed" ? "#fecaca" : "#bbf7d0"
                }}
              >
                {log.status === "failed" ? "❌ FAILED" : "✅ SUCCESS"}
              </span>

              <span style={styles.date}>
                {log.createdAt
                  ? new Date(log.createdAt).toLocaleString()
                  : "No timestamp"}
              </span>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Pipeline Logs</h3>
              <pre style={styles.logBox}>{log.logs}</pre>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>AI Analysis</h3>
              <pre style={styles.analysisBox}>{log.ai_analysis}</pre>
            </div>
          </div>
        ))}
      </div>

      <p style={styles.footer}>
        AI-powered CI/CD monitoring system using GitHub Actions, Docker, EC2 and MongoDB
      </p>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top left, #1e3a8a, #0f172a 45%, #020617)",
    color: "#f9fafb",
    padding: "32px",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px"
  },
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#052e16",
    color: "#bbf7d0",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "12px",
    border: "1px solid #166534"
  },
  liveDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    boxShadow: "0 0 12px #22c55e"
  },
  title: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "900",
    letterSpacing: "0.5px"
  },
  subtitle: {
    marginTop: "8px",
    color: "#cbd5e1",
    fontSize: "15px"
  },
  refreshButton: {
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "13px 20px",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 10px 25px rgba(37,99,235,0.35)"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "22px"
  },
  statCard: {
    backgroundColor: "rgba(31,41,55,0.85)",
    padding: "20px",
    borderRadius: "18px",
    border: "1px solid #374151",
    boxShadow: "0 12px 28px rgba(0,0,0,0.3)"
  },
  statLabel: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px"
  },
  statValue: {
    margin: "8px 0 0",
    fontSize: "32px"
  },
  controls: {
    display: "flex",
    gap: "12px",
    marginBottom: "10px",
    flexWrap: "wrap"
  },
  searchInput: {
    flex: 1,
    minWidth: "240px",
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #475569",
    backgroundColor: "#020617",
    color: "white",
    outline: "none"
  },
  select: {
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #475569",
    backgroundColor: "#020617",
    color: "white"
  },
  updatedText: {
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "20px"
  },
  logsContainer: {
    display: "grid",
    gap: "20px"
  },
  logCard: {
    backgroundColor: "rgba(31,41,55,0.9)",
    border: "1px solid #374151",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 16px 35px rgba(0,0,0,0.35)"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    gap: "12px",
    flexWrap: "wrap"
  },
  badge: {
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900"
  },
  date: {
    color: "#9ca3af",
    fontSize: "13px"
  },
  section: {
    marginTop: "14px"
  },
  sectionTitle: {
    marginBottom: "8px",
    color: "#e5e7eb"
  },
  logBox: {
    backgroundColor: "#020617",
    padding: "14px",
    borderRadius: "12px",
    color: "#e5e7eb",
    whiteSpace: "pre-wrap",
    overflowX: "auto",
    border: "1px solid #334155"
  },
  analysisBox: {
    backgroundColor: "#052e16",
    padding: "14px",
    borderRadius: "12px",
    color: "#d1fae5",
    whiteSpace: "pre-wrap",
    overflowX: "auto",
    border: "1px solid #166534"
  },
  message: {
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: "40px"
  },
  error: {
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    padding: "12px",
    borderRadius: "10px"
  },
  footer: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "35px",
    fontSize: "13px"
  }
}

export default Dashboard