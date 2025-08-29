"use client";

import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

interface CircularTimerProps {
    duration?: number;
    size?: number;
    enable: boolean;
    refetch?: (
        options?: RefetchOptions,
    ) => Promise<
        QueryObserverResult<
            { label: string; token: string; id: string }[],
            Error
        >
    >;
}

export default function CircularTimer({
    duration = 30,
    size = 80,
    enable,
    refetch,
}: CircularTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [startFetching, setStartFetching] = useState(false);

    const radius = size / 2 - 6;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        if (!enable) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (!startFetching) setStartFetching(true);
                    return duration;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [duration, enable]);

    const progressOffset =
        circumference - (timeLeft / duration) * circumference;

    useEffect(() => {
        if (!startFetching) return;
        if (timeLeft === duration) {
            refetch();
            console.log("30 seconds passed, fetching new records.");
        }
    }, [duration, timeLeft, startFetching]);

    return (
        <div className="relative flex items-center justify-center">
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth="2"
                    fill="transparent"
                    className="text-slate-200"
                    stroke="currentColor"
                />

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth="2"
                    fill="transparent"
                    stroke="currentColor"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-linear ${
                        timeLeft > duration * 0.66
                            ? "text-emerald-500"
                            : timeLeft > duration * 0.33
                              ? "text-amber-500"
                              : "text-red-500"
                    }`}
                />
            </svg>

            <span className="text-muted-foreground absolute -translate-x-2/4 left-2/4 -translate-y-2/4 top-2/4 font-bold">
                {timeLeft.toString().padStart(2, "0")}
            </span>
        </div>
    );
}
