import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  query, 
  orderBy, 
  limit,
  where,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';

export const firebaseHumService = {
  // Upload hum audio file to Firebase Storage
  async uploadHumAudio(audioBlob, filename) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const storageRef = ref(storage, `hums/${user.uid}/${filename}`);
      const snapshot = await uploadBytes(storageRef, audioBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Create a new hum document
  async uploadHum(audioBlob, title, description = '') {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Upload audio file
      const filename = `hum_${Date.now()}.wav`;
      const audioURL = await this.uploadHumAudio(audioBlob, filename);

      // Create hum document
      const humData = {
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        title,
        description,
        audioURL,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        likedBy: [],
        matchedSong: null,
        isRemix: false,
        originalHumId: null,
        remixParams: null
      };

      const docRef = await addDoc(collection(db, 'hums'), humData);
      
      // Update user's hum count
      await updateDoc(doc(db, 'users', user.uid), {
        totalHums: increment(1)
      });

      return {
        hum_id: docRef.id,
        ...humData
      };
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Simulate song matching (you can integrate with your AI model here)
  async matchHum(humId) {
    try {
      // This is a mock implementation
      // In a real app, you'd send the audio to your AI model
      const mockMatches = [
        {
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          album: 'After Hours',
          confidence: 85,
          preview_url: null
        },
        {
          title: 'Shape of You',
          artist: 'Ed Sheeran',
          album: '÷ (Divide)',
          confidence: 72,
          preview_url: null
        }
      ];

      // Update the hum document with matched song
      if (mockMatches.length > 0) {
        await updateDoc(doc(db, 'hums', humId), {
          matchedSong: mockMatches[0]
        });

        // Update user's songs identified count
        const user = auth.currentUser;
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            songsIdentified: increment(1)
          });
        }
      }

      return { matches: mockMatches };
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Create a remix of an existing hum
  async remixHum(originalHumId, remixParams) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Get original hum
      const originalHumDoc = await getDoc(doc(db, 'hums', originalHumId));
      if (!originalHumDoc.exists()) {
        throw new Error('Original hum not found');
      }

      const originalHum = originalHumDoc.data();

      // In a real implementation, you would process the audio here
      // For now, we'll just create a new hum document with remix parameters
      const remixData = {
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        title: `Remix of ${originalHum.title}`,
        description: `Remixed with pitch: ${remixParams.pitch}, speed: ${remixParams.speed}x`,
        audioURL: originalHum.audioURL, // In reality, this would be the processed audio
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        likedBy: [],
        matchedSong: originalHum.matchedSong,
        isRemix: true,
        originalHumId: originalHumId,
        remixParams: remixParams
      };

      const docRef = await addDoc(collection(db, 'hums'), remixData);

      // Update user's hum count
      await updateDoc(doc(db, 'users', user.uid), {
        totalHums: increment(1)
      });

      return {
        hum_id: docRef.id,
        remixed_audio: originalHum.audioURL // Mock remixed audio
      };
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Get feed of hums
  async getFeed() {
    try {
      const q = query(
        collection(db, 'hums'), 
        orderBy('createdAt', 'desc'), 
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const hums = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        hums.push({
          id: doc.id,
          ...data,
          isLiked: data.likedBy?.includes(auth.currentUser?.uid) || false
        });
      });

      return { hums };
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Like/unlike a hum
  async likeHum(humId) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const humRef = doc(db, 'hums', humId);
      const humDoc = await getDoc(humRef);
      
      if (!humDoc.exists()) {
        throw new Error('Hum not found');
      }

      const humData = humDoc.data();
      const isLiked = humData.likedBy?.includes(user.uid) || false;

      if (isLiked) {
        // Unlike
        await updateDoc(humRef, {
          likes: increment(-1),
          likedBy: humData.likedBy.filter(uid => uid !== user.uid)
        });
      } else {
        // Like
        await updateDoc(humRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid)
        });
      }

      return { success: true };
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Add comment to a hum
  async commentHum(humId, commentText) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const comment = {
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        text: commentText,
        createdAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'hums', humId), {
        comments: arrayUnion(comment)
      });

      // Update user's comment count
      await updateDoc(doc(db, 'users', user.uid), {
        totalComments: increment(1)
      });

      return { success: true };
    } catch (error) {
      throw { message: error.message };
    }
  },

  // Get user profile with their hums
  async getProfile(userId = null) {
    try {
      const targetUserId = userId || auth.currentUser?.uid;
      if (!targetUserId) throw new Error('User not authenticated');

      // Get user data
      const userDoc = await getDoc(doc(db, 'users', targetUserId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();

      // Get user's hums
      const q = query(
        collection(db, 'hums'),
        where('userId', '==', targetUserId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const hums = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        hums.push({
          id: doc.id,
          ...data
        });
      });

      return {
        user: userData,
        stats: {
          totalHums: userData.totalHums || 0,
          totalLikes: userData.totalLikes || 0,
          totalComments: userData.totalComments || 0,
          songsIdentified: userData.songsIdentified || 0
        },
        hums
      };
    } catch (error) {
      throw { message: error.message };
    }
  }
};