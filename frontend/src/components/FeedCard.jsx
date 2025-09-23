import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Play, Pause, User } from 'lucide-react';

const FeedCard = ({ hum, onLike, onComment }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(hum.isLiked || false);

  const handleLike = async () => {
    try {
      await onLike(hum.id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking hum:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await onComment(hum.id, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{hum.username}</h3>
            <p className="text-sm text-gray-500">{hum.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-medium text-gray-800 mb-2">{hum.title}</h4>
        {hum.description && (
          <p className="text-gray-600 mb-3">{hum.description}</p>
        )}

        {/* Audio Player */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={togglePlay}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <div className="text-sm text-gray-500">{hum.duration}</div>
          </div>
          
          {/* Waveform visualization */}
          <div className="h-12 bg-white rounded flex items-center justify-center">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 40 }, (_, i) => (
                <div
                  key={i}
                  className="w-1 bg-purple-400 rounded-full"
                  style={{
                    height: `${Math.random() * 30 + 4}px`,
                    opacity: isPlaying ? 1 : 0.5
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Match Information */}
        {hum.matchedSong && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <h5 className="font-medium text-green-800 mb-1">Matched Song</h5>
            <p className="text-green-700">{hum.matchedSong.title}</p>
            <p className="text-sm text-green-600">{hum.matchedSong.artist}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{hum.likes}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{hum.comments?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Post
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {hum.comments?.map((comment, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-sm text-gray-800">{comment.username}</p>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{comment.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedCard;