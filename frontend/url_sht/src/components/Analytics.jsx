import { useEffect, useState } from "react";
import { fetchAnalytics } from "../services/api";

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnalytics()
      .then(data => {
        console.log("Analytics data received:", data);
        setData(data);
      })
      .catch(err => {
        console.error("Failed to fetch analytics:", err);
      });
  }, []);

  return (
    <div>
      <h3>Analytics</h3>
      <ul>
        {data.map((entry, idx) => (
          <li key={idx}>
            {entry.shortUrl} clicked {entry.clicks} times
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Analytics;
