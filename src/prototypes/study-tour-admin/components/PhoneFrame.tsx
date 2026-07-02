import React from 'react';
import { BatteryFull, Signal, Wifi } from 'lucide-react';

interface PhoneFrameProps {
    children: React.ReactNode;
    time?: string;
}

export default function PhoneFrame({ children, time = '9:41' }: PhoneFrameProps) {
    return (
        <div className="stage chinese-font">
            <div className="phone">
                <div className="statusbar">
                    <span className="sb-time">{time}</span>
                    <span className="sb-island" />
                    <span className="sb-icons">
                        <Signal size={15} />
                        <Wifi size={15} />
                        <BatteryFull size={20} />
                    </span>
                </div>

                {children}

                <div className="home-indicator" />
            </div>
        </div>
    );
}
