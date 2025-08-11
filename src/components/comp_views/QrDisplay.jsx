const QrDisplay = ({ qrCodeUrl, onClose }) => {
    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = qrCodeUrl;
        a.download = "route-qr.png";
        a.click();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
                <h2 className="text-lg font-bold">Route QR Code</h2>
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
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
