import React, { useEffect, useState } from "react";
import { fetchAnalytics } from "../services/api";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton, Box } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({});

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setIsLoading(false);
      }
    };
    getAnalytics();
  }, []);

  const toggleRow = (index) => {
    setOpenRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (isLoading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (analyticsData.length === 0) {
    return <p>No analytics data available yet.</p>;
  }

  return (
    <section>
      <Typography variant="h5" gutterBottom>
        Analytics
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="analytics table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Total Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analyticsData.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => toggleRow(index)}
                    >
                      {openRows[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <a href={item.shortUrl} target="_blank" rel="noreferrer">
                      {item.shortUrl}
                    </a>
                  </TableCell>
                  <TableCell>{item.originalUrl}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{item.expiresAt ? new Date(item.expiresAt).toLocaleString() : "No expiry"}</TableCell>
                  <TableCell>{item.totalClicks}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="subtitle1" gutterBottom component="div">
                          Click Details
                        </Typography>
                        <Table size="small" aria-label="click details">
                          <TableHead>
                            <TableRow>
                              <TableCell>Timestamp</TableCell>
                              <TableCell>Source</TableCell>
                              <TableCell>Location</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.clicks.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={3} align="center">No clicks recorded</TableCell>
                              </TableRow>
                            ) : (
                              item.clicks.map((click, i) => (
                                <TableRow key={i}>
                                  <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                  <TableCell>{click.source}</TableCell>
                                  <TableCell>{click.location}</TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};

export default Analytics;
