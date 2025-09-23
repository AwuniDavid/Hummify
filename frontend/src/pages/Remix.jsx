// In frontend/src/pages/Remix.jsx

import { AlertCircle, Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import RemixControls from '../components/RemixControls';
import { backendHumService } from '../services/backendHumService';

const Remix = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [remixedUrl, setRemixedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        setRemixedUrl(null);
        setError('');
      } else {
        setError('Please select a valid audio file');
      }
    }
  };

  const handleRemix = async (remixParams) => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError('');
    setRemixedUrl(null);
    try {
      const result = await backendHumService.remixHum(selectedFile, remixParams);
      setRemixedUrl(result.remixed_url);
    } catch (error) {
      setError(error.message || 'Remix failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Remix Your Hum</h1>
          <p className="text-lg text-gray-600">Upload an audio file and transform it with creative effects</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="w-full py-10 border-2 border-dashed border-gray-300 hover:border-purple-500 rounded-lg flex flex-col items-center justify-center space-y-2 text-gray-500 hover:text-purple-600 transition-colors">
            <Upload className="h-10 w-10" />
            <span>{selectedFile ? `Selected: ${selectedFile.name}` : 'Drop your audio file here or click to browse'}</span>
          </button>
        </div>

        {selectedFile && <RemixControls onRemix={handleRemix} isLoading={isLoading} />}

        {remixedUrl && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Remix is Ready!</h3>
            <audio controls src={remixedUrl} className="w-full mb-4">Your browser does not support the audio element.</audio>
            <a href={remixedUrl} download={`remix-${selectedFile.name}`} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Download Remix</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Remix;