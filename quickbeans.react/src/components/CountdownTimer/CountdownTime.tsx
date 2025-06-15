import { useEffect, useState } from 'react';

const CountdownTimer = ({ expires, onExpired }: { expires: number | Date | string; onExpired: () => void }) => {
  const expiresTime = typeof expires === 'string' ? Date.parse(expires) : new Date(expires).getTime();
  const [timeLeft, setTimeLeft] = useState(expiresTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1000);
      if (timeLeft <= 0) {
        clearInterval(interval);
        onExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpired]);

  return (
    <div>
      {timeLeft > 0 ? (
        <p>
          Time left: {Math.floor((timeLeft / 1000) / 60)}:
          {String(Math.floor((timeLeft / 1000) % 60)).padStart(2, '0')} minutes
        </p>
      ) : (
        <p>Time is up!</p>
      )}
    </div>
  );
};

export default CountdownTimer;
