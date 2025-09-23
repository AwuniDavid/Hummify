import { AlertCircle, CheckCircle, Music, Search, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import { backendHumService } from '../services/backendHumService';

const Record = () => {
  const [recording, setRecording] = useState(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleRecordingComplete = (audioBlob) => {
    const audioFile = new File([audioBlob], 'hum-recording.wav', { type: audioBlob.type });
    setRecording(audioFile);
    setResult(null);
    setError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError('Please upload a valid audio file.');
        return;
      }
      setRecording(file);
      setResult(null);
      setError('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadAndMatch = async () => {
    if (!recording) {
      setError('Please record or upload an audio file first.');
      return;
    }

    const finalTitle = title.trim() || recording.name;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await backendHumService.uploadAndMatchHum(recording, finalTitle);
      setResult(response);
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Identify a Song</h1>
          <p className="text-lg text-gray-600">
            Hum a tune, or upload an audio file, and let our AI find the song for you.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* --- SECTION 1: Recording and Uploading --- */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Record a Hum</h3>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          <div className="text-center my-6">
            <p className="text-gray-500">— OR —</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload an Audio File</span>
          </button>
        </div>

        {/* --- SECTION 2: Title and Submit --- */}
        {recording && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {recording.name === 'hum-recording.wav'
                ? 'Your Recorded Hum is Ready'
                : `File Ready: ${recording.name}`}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Give it a title (optional)
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., That song from the movie..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleUploadAndMatch}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Searching...</span>
                ) : (
                  <>
                    <Music className="h-5 w-5" />
                    <span>Find My Song</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* --- SECTION 3: Match Results --- */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Match Results
              </h3>
              <button
                onClick={() => {
                  setRecording(null);
                  setResult(null);
                  setTitle('');
                }}
                className="text-sm text-purple-600 hover:underline"
              >
                Start over
              </button>
            </div>

            {result.matches && result.matches.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-2">
                  Here are the best matches we found for your audio:
                </p>
                {result.matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{match.title}</h4>
                        <p className="text-gray-600">{match.artist}</p>
                        <p className="text-sm text-gray-500">{match.album}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(match.confidence * 100)}%
                        </div>
                        <div className="text-sm text-gray-500">confidence</div>
                      </div>
                    </div>

                    {(match.spotify_url || match.youtube_url || match.apple_music_url) && (
                      <div className="mt-4 pt-3 border-t border-green-200 flex items-center space-x-3">
                        <p className="text-sm font-medium text-gray-700">Listen on:</p>
                        {match.spotify_url && (
                          <a
                            href={match.spotify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Spotify
                          </a>
                        )}
                        {match.youtube_url && (
                          <a
                            href={match.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            YouTube
                          </a>
                        )}
                        {match.apple_music_url && (
                          <a
                            href={match.apple_music_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors"
                          >
                            Apple Music
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  We couldn't find any potential matches. Please try a different recording or file.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Record;
