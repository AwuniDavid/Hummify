import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import FeedCard from '../components/FeedCard';
import { backendHumService } from '../services/backendHumService';
import { firebaseHumService } from '../services/firebaseHumService';

const Feed = () => {
  const [hums, setHums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [useEnhancedFeed, setUseEnhancedFeed] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setError('');

      if (useEnhancedFeed) {
        try {
          // Try to get enhanced feed from backend
          const result = await backendHumService.getEnhancedFeed();
          setHums(result.hums || []);
        } catch (backendError) {
          console.warn('Enhanced feed failed, using Firebase:', backendError);
          // Fallback to Firebase feed
          const result = await firebaseHumService.getFeed();
          setHums(result.hums || []);
        }
      } else {
        // Use Firebase feed
        const result = await firebaseHumService.getFeed();
        setHums(result.hums || []);
      }
    } catch (error) {
      setError(error.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const handleLike = async (humId) => {
    try {
      await firebaseHumService.likeHum(humId);
      // Update local state
      setHums(hums.map(hum =>
        hum.id === humId
          ? { ...hum, likes: hum.likes + (hum.isLiked ? -1 : 1), isLiked: !hum.isLiked }
          : hum
      ));
    } catch (error) {
      console.error('Error liking hum:', error);
    }
  };

  const handleComment = async (humId, comment) => {
    try {
      await firebaseHumService.commentHum(humId, comment);
      // Refresh the feed to get updated comments
      await loadFeed();
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  // Sample data for demonstration
  const sampleHums = [
    {
      id: 1,
      username: 'MusicLover23',
      title: 'That catchy tune from the radio',
      description: 'Been stuck in my head all day!',
      createdAt: '2 hours ago',
      likes: 15,
      isLiked: false,
      duration: '0:15',
      comments: [
        { username: 'SongSeeker', text: 'I think I know this one!', createdAt: '1 hour ago' },
        { username: 'HummerFan', text: 'Great humming skills!', createdAt: '45 minutes ago' }
      ],
      matchedSong: {
        title: 'Blinding Lights',
        artist: 'The Weeknd'
      }
    },
    {
      id: 2,
      username: 'TuneHunter',
      title: 'Classical piece I heard',
      description: 'Beautiful melody from a movie soundtrack',
      createdAt: '5 hours ago',
      likes: 28,
      isLiked: true,
      duration: '0:22',
      comments: [
        { username: 'ClassicalFan', text: 'Sounds like Vivaldi!', createdAt: '3 hours ago' }
      ]
    },
    {
      id: 3,
      username: 'HumItUp',
      title: 'Remix of yesterday\'s hum',
      description: 'Added some echo and pitched it up',
      createdAt: '1 day ago',
      likes: 42,
      isLiked: false,
      duration: '0:18',
      comments: []
    }
  ];

  const displayHums = hums.length > 0 ? hums : sampleHums;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Feed</h1>
            <p className="text-lg text-gray-600">
              Discover and share amazing hums from the community
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useEnhancedFeed"
                checked={useEnhancedFeed}
                onChange={(e) => setUseEnhancedFeed(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="useEnhancedFeed" className="text-sm font-medium text-gray-700">
                Enhanced Feed
              </label>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feed...</p>
          </div>
        ) : (
          /* Feed Cards */
          <div className="space-y-6">
            {displayHums.map((hum) => (
              <FeedCard
                key={hum.id}
                hum={hum}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}

            {displayHums.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No hums yet</h3>
                <p className="text-gray-500">
                  Be the first to share a hum with the community!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Feed Info */}
        {useEnhancedFeed && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Enhanced Feed:</strong> Powered by our AI backend for better song matching,
              advanced audio analysis, and improved recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;