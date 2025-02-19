'use client';

import React, { useState } from 'react';

export function CopyToClipboard({ text, children }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    return (
        <div className="relative inline-flex items-center" onClick={handleCopy}>
            {children}
            {copied && (
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Copied!
                </span>
            )}
        </div>
    );
}
