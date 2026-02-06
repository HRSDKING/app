import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CountdownTimer = ({ targetDate, label }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  if (!timeLeft.days && timeLeft.days !== 0) {
    return <p className="text-[#A1A1AA]">Launched!</p>;
  }

  return (
    <div data-testid="countdown-timer">
      {label && (
        <p className="text-[#A1A1AA] text-sm uppercase tracking-widest mb-4">
          {label}
        </p>
      )}
      <div className="flex gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1a1a1a] border border-[#D4AF37]/20 flex items-center justify-center mb-2">
              <span className="font-display text-2xl md:text-3xl text-[#D4AF37]">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[#52525B] text-xs uppercase tracking-wider">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
