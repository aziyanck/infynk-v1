import { useState } from "react";
import { Copy, Check } from "lucide-react";

const QrDisplay = ({ qrCodeUrl, onClose, routeId }) => {
    const [copied, setCopied] = useState(false);

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = qrCodeUrl;
        a.download = `QR-${routeId}.png`;
        a.click();
    };

    const handleCopyLink = () => {
        const link = `https://pixiic.com/${routeId}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const link = `https://pixiic.com/${routeId}`;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
                <h2 className="text-lg font-bold">Route QR Code</h2>
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded w-full">
                    <span className="text-sm text-gray-600 truncate flex-1">{link}</span>
                    <button
                        onClick={handleCopyLink}
                        className="shrink-0 p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Copy link"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QrDisplay;
