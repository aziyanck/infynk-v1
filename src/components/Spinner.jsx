import React from 'react';

const Spinner = ({ size = 'sm', color = 'text-white' }) => {
    // Map size props to Tailwind classes
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
    };

    const className = `animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${color}`;

    return (
        <div className={className} role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
