// In frontend/src/components/RemixControls.jsx

import { RotateCcw, Wand2 } from 'lucide-react';
import { useState } from 'react';

const RemixControls = ({ onRemix, isLoading }) => {
  const [controls, setControls] = useState({ pitch: 0, speed: 1, echo: 0, reverb: 0, reverse: false });

  const handleControlChange = (control, value) => {
    setControls(prev => ({ ...prev, [control]: value }));
  };

  const resetControls = () => {
    setControls({ pitch: 0, speed: 1, echo: 0, reverb: 0, reverse: false });
  };

  const applyRemix = () => {
    onRemix(controls);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Remix Controls</h3>
        <p className="text-gray-600">Adjust the parameters to create your unique remix</p>
      </div>

      <div className="space-y-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pitch Shift: {controls.pitch > 0 ? '+' : ''}{controls.pitch} semitones</label>
          <input type="range" min="-12" max="12" step="1" value={controls.pitch} onChange={(e) => handleControlChange('pitch', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Speed: {controls.speed.toFixed(1)}x</label>
          <input type="range" min="0.5" max="2" step="0.1" value={controls.speed} onChange={(e) => handleControlChange('speed', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Echo: {controls.echo}%</label>
          <input type="range" min="0" max="100" step="5" value={controls.echo} onChange={(e) => handleControlChange('echo', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reverb: {controls.reverb}%</label>
          <input type="range" min="0" max="100" step="5" value={controls.reverb} onChange={(e) => handleControlChange('reverb', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="flex items-center">
          <input id="reverse" type="checkbox" checked={controls.reverse} onChange={(e) => handleControlChange('reverse', e.target.checked)} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
          <label htmlFor="reverse" className="ml-3 block text-sm font-medium text-gray-700">Reverse Audio</label>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={resetControls} className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"><RotateCcw className="h-4 w-4" /><span>Reset</span></button>
        <button onClick={applyRemix} disabled={isLoading} className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors">
          {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div><span>Processing...</span></>) : <><Wand2 className="h-5 w-5" /><span>Apply Remix</span></>}
        </button>
      </div>
    </div>
  );
};
export default RemixControls;