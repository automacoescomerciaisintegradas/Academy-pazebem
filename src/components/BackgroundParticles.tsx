import React from 'react';
const BackgroundParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" id="particles-js">
        <style>{`
          #particles-js {
            width: 100%;
            height: 100%;
            background-color: transparent;
            background-image: url('');
            background-size: cover;
            background-position: 50% 50%;
            background-repeat: no-repeat;
          }
          .particle {
            position: absolute;
            border-radius: 50%;
            background: #32CD32;
            opacity: 0;
            animation: rise 10s infinite ease-in;
          }
          @keyframes rise {
            0% {
              transform: translateY(100vh) scale(0.5);
              opacity: 0;
            }
            10% {
              opacity: 0.7;
            }
            90% {
              opacity: 0.7;
            }
            100% {
              transform: translateY(-10vh) scale(1);
              opacity: 0;
            }
          }
        `}</style>
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 3 + 1;
          const left = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = Math.random() * 5 + 5;
          return (
            <div
              key={i}
              className="particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
export default BackgroundParticles;