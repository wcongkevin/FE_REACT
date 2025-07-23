import React, { useState, useEffect } from "react";
import { BallTriangle } from "react-loader-spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Report.css";

const Report: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Mimic loading time for demonstration
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container-fluid row h-100">
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            zIndex: 1020,
            top: 0,
            height: "100%",
            position: "absolute",
            width: "100%",
            backgroundColor: "rgba(51, 51, 51, 0.8)",
          }}
        >
          <BallTriangle
            height={100}
            width={100}
            color="white"
            ariaLabel="loading"
          />
          <div style={{ position: "absolute", color: "white" }}>
            <b>Please Wait....</b>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <iframe
              title="webapp Dev"
              src="https://app.powerbi.com/reportEmbed?reportId=xxxxx"
              frameBorder="0"
              style={{ width: '100%', height: '800px' }}
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;