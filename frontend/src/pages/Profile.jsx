import { Calendar, Edit, Heart, MessageCircle, Music, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { backendHumService } from '../services/backendHumService';
import { firebaseHumService } from '../services/firebaseHumService';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('hums');
  const [backendSynced, setBackendSynced] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    loadProfile();
    syncWithBackend();
  }, []);

  const loadProfile = async () => {
    try {
      setError('');
      const result = await firebaseHumService.getProfile();
      setProfileData(result);
    } catch (error) {
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const syncWithBackend = async () => {
    try {
      await backendHumService.syncUserProfile();
      setBackendSynced(true);
    } catch (error) {
      console.warn('Backend sync failed:', error);
      setBackendSynced(false);
    }
  };
  // Sample data for demonstration
  const sampleProfile = {
    user: {
      username: currentUser?.username || 'User',
      email: currentUser?.email || 'user@example.com',
      joinDate: '2024-01-15',
      bio: 'Music enthusiast and hum collector 🎵'
    },
    stats: {
      totalHums: 24,
      totalLikes: 156,
      totalComments: 43,
      songsIdentified: 18
    },
    hums: [
      {
        id: 1,
        title: 'That song from the coffee shop',
        createdAt: '2 days ago',
        likes: 12,
        comments: 5,
        duration: '0:15',
        matchedSong: { title: 'Blinding Lights', artist: 'The Weeknd' }
      },
      {
        id: 2,
        title: 'Classical melody',
        createdAt: '5 days ago',
        likes: 8,
        comments: 2,
        duration: '0:22',
        matchedSong: null
      },
      {
        id: 3,
        title: 'Remix experiment',
        createdAt: '1 week ago',
        likes: 25,
        comments: 8,
        duration: '0:18',
        matchedSong: { title: 'Shape of You', artist: 'Ed Sheeran' }
      }
    ]
  };

  const displayData = profileData || sampleProfile;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{displayData.user.username}</h1>
                <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
                {backendSynced && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    AI Enhanced
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-2">{displayData.user.email}</p>
              <p className="text-gray-700 mb-3">{displayData.user.bio}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {displayData.user.joinDate}</span>
              </div>
            </div>
          </div>

          {!backendSynced && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Tip:</strong> Your profile will be enhanced with AI features once you use our advanced processing options.
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{displayData.stats.totalHums}</div>
            <div className="text-sm text-gray-600">Total Hums</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">{displayData.stats.totalLikes}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{displayData.stats.totalComments}</div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{displayData.stats.songsIdentified}</div>
            <div className="text-sm text-gray-600">
              Songs Found{backendSynced && <span className="text-green-600"> (AI)</span>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('hums')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'hums'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                My Hums
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'liked'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Liked Hums
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'hums' && (
              <div className="space-y-4">
                {displayData.hums.map((hum) => (
                  <div key={hum.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{hum.title}</h3>
                      <span className="text-sm text-gray-500">{hum.createdAt}</span>
                    </div>

                    <div className="flex items-center space-x-6 mb-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Music className="h-4 w-4" />
                        <span>{hum.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Heart className="h-4 w-4" />
                        <span>{hum.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MessageCircle className="h-4 w-4" />
                        <span>{hum.comments}</span>
                      </div>
                    </div>

                    {hum.matchedSong && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <div className="text-sm font-medium text-green-800">Matched Song</div>
                        <div className="text-green-700">{hum.matchedSong.title}</div>
                        <div className="text-sm text-green-600">{hum.matchedSong.artist}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'liked' && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No liked hums yet</h3>
                <p className="text-gray-500">
                  Explore the feed and like some hums to see them here!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;