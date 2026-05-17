import { useEffect, useState } from "react"
import axios from "axios"

function Dashboard() {
  const [logs, setLogs] = useState([])
  const pendi == useState={[]}
  useEffect(() => {
  const fetchLogs = () => {
    axios.get("http://13.233.245.247:5000/api/logs")
      .then(res => setLogs(res.data))
      .catch(err => console.error(err))
  }

  fetchLogs()

  const interval = setInterval(fetchLogs, 5000)

  return () => clearInterval(interval)
}, [])

  return (
    <div>
      <h2>AI CI CD MONITORING DASHBOARD !!</h2>

      {logs.map((log) => (
        <div key={log._id} style={{border: "1px solid gray", margin: "10px", padding: "10px"}}>
          
          <p><strong>Status:</strong> {log.status}</p>
          <p><strong>Logs:</strong> {log.logs}</p>
          <p><strong>AI Analysis:</strong></p>
          <pre>{log.ai_analysis}</pre>

        </div>
      ))}
    </div>
  )
}

export default Dashboard