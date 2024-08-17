import React from "react";

const AnimatedHeartbeat = () => {
  return (
    <div className="heartbeat-container">
      <svg
        width="100%"
        height="50"
        viewBox="0 0 300 50"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id="heartbeatGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </linearGradient>
        </defs>
        <path
          d="M0,25 L30,25 Q35,25 37.5,20 T45,25 T52.5,30 T60,25 L90,25 Q95,25 97.5,20 T105,25 T112.5,30 T120,25 L150,25 Q155,25 157.5,20 T165,25 T172.5,30 T180,25 L210,25 Q215,25 217.5,20 T225,25 T232.5,30 T240,25 L270,25 Q275,25 277.5,20 T285,25 T292.5,30 T300,25"
          fill="none"
          stroke="url(#heartbeatGradient)"
          strokeWidth="2"
          className="heartbeat"
        />
      </svg>
      <style jsx>{`
        .heartbeat-container {
          width: 100%;
          overflow: hidden;
          padding: 20px 0;
          margin-bottom: 0px;
        }
        .heartbeat {
          animation: heartbeat-animation 2s linear infinite;
        }
        @keyframes heartbeat-animation {
          0% {
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
          }
          100% {
            stroke-dasharray: 300;
            stroke-dashoffset: -300;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedHeartbeat;
