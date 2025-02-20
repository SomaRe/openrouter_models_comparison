'use client';

'use client';

import React, { useState } from 'react';

export default function CopyToClipboard({ text, children }) {
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
        <div className="relative inline-flex items-center justify-between" onClick={handleCopy}>
            {children}
            {copied && (
                <div className="toast toast-top">
                    <div className="alert alert-success">
                        <span>Copied!</span>
                    </div>
                </div>
            )}
        </div>
    );
}
