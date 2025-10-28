import { useEffect, useRef } from 'react';

// Generate random stars
function generateStars(count: number) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      left: Math.random() * 2000,
      top: Math.random() * 2000,
    });
  }
  return stars;
}

export function StarsBackground() {
  const stars1 = useRef(generateStars(700));
  const stars2 = useRef(generateStars(200));
  const stars3 = useRef(generateStars(100));

  return (
    <>
      <style>{`
        @keyframes animStar {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-2000px);
          }
        }

        .stars-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #f8f8f8;
        }

        .stars-small {
          position: absolute;
          width: 1px;
          height: 1px;
          background: transparent;
          animation: animStar 50s linear infinite;
        }

        .stars-small::after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: inherit;
        }

        .stars-medium {
          position: absolute;
          width: 2px;
          height: 2px;
          background: transparent;
          animation: animStar 100s linear infinite;
        }

        .stars-medium::after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: inherit;
        }

        .stars-big {
          position: absolute;
          width: 3px;
          height: 3px;
          background: transparent;
          animation: animStar 150s linear infinite;
        }

        .stars-big::after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: inherit;
        }
      `}</style>

      <div className="stars-container">
        {/* Small stars */}
        <div
          className="stars-small"
          style={{
            boxShadow: stars1.current
              .map((star) => `${star.left}px ${star.top}px #b10505`)
              .join(', '),
          }}
        />

        {/* Medium stars */}
        <div
          className="stars-medium"
          style={{
            boxShadow: stars2.current
              .map((star) => `${star.left}px ${star.top}px #b10505`)
              .join(', '),
          }}
        />

        {/* Big stars */}
        <div
          className="stars-big"
          style={{
            boxShadow: stars3.current
              .map((star) => `${star.left}px ${star.top}px #b10505`)
              .join(', '),
          }}
        />
      </div>
    </>
  );
}
