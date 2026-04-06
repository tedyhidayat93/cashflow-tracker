import { useState, useEffect } from 'react';

// Menambahkan prop 'className' untuk menangani sizing dan styling tambahan dari luar
export const AnimatedNumber = ({ 
    value, 
    prefix = "", 
    colorClass = "", 
    className = "text-3xl" // Default ukuran jika tidak diisi
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const endValue = parseInt(value);

    // Effect 1: Animasi Awal (0 ke Target)
    useEffect(() => {
        let start = 0;
        const duration = 1500; 
        const increment = endValue / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= endValue) {
                setDisplayValue(endValue);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [endValue]);

    // Effect 2: Efek Fluktuasi
    useEffect(() => {
        const timeout = setTimeout(() => {
            const jitterTimer = setInterval(() => {
                setDisplayValue(prev => {
                    const drift = Math.floor(Math.random() * 101) - 50; 
                    const newValue = prev + drift;
                    if (Math.abs(newValue - endValue) > endValue * 0.001) {
                        return prev; 
                    }
                    return newValue;
                });
            }, 2000);

            return () => clearInterval(jitterTimer);
        }, 1600);

        return () => clearTimeout(timeout);
    }, [endValue]);

    return (
        /* className digabungkan dengan style dasar */
        <div className={`font-bold tracking-tighter tabular-nums transition-all duration-700 ${colorClass} ${className}`}>
            {prefix} {displayValue.toLocaleString('id-ID')}
        </div>
    );
};