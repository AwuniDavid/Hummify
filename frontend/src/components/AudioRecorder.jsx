import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        onRecordingComplete?.(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // Set up audio context for waveform visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      visualizeWaveform();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const visualizeWaveform = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Convert to normalized values for display
      const normalizedData = Array.from(dataArray).map(value => value / 255);
      setWaveformData(normalizedData);
      
      if (isRecording) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const downloadAudio = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = 'hum-recording.wav';
      a.click();
    }
  };

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioURL]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Record Your Hum</h3>
        <p className="text-gray-600">Click the microphone to start recording</p>
      </div>

      {/* Waveform Visualization */}
      <div className="mb-6 h-24 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
        {waveformData.length > 0 ? (
          <div className="flex items-center space-x-1 h-full">
            {waveformData.slice(0, 64).map((value, index) => (
              <div
                key={index}
                className="bg-purple-500 rounded-full transition-all duration-100"
                style={{
                  width: '3px',
                  height: `${Math.max(4, value * 60)}px`,
                  opacity: isRecording ? 1 : 0.5
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400">
            {isRecording ? 'Recording...' : 'Waveform will appear here'}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Mic className="h-5 w-5" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Square className="h-5 w-5" />
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {/* Audio Playback */}
      {audioBlob && (
        <div className="border-t pt-6">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={isPlaying ? pauseAudio : playAudio}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={downloadAudio}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>

          <audio
            ref={audioRef}
            src={audioURL}
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={() => setIsPlaying(false)}
            className="w-full"
            controls
          />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;