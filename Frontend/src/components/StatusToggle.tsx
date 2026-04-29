import React from 'react';
import { clsx } from 'clsx';

interface StatusToggleProps {
    status: boolean;
    onChange: (newStatus: boolean) => void;
    disabled?: boolean;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ status, onChange, disabled }) => {
    return (
        <button
            onClick={() => !disabled && onChange(!status)}
            disabled={disabled}
            className={clsx(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed",
                status ? "bg-brand-blue" : "bg-gray-200"
            )}
        >
            <span
                role="presentation"
                className={clsx(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    status ? "translate-x-5" : "translate-x-0"
                )}
            />
        </button>
    );
};

export default StatusToggle;
