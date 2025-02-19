"use client";

import React from 'react';
import { Copy } from 'lucide-react';

const CopyToClipboard = ({ text }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Copy className="h-4 w-4 ml-2 cursor-pointer" onClick={copyToClipboard} />;
    );
};

export default CopyToClipboard;
