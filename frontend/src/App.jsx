import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

import Feed from './pages/Feed';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Record from './pages/Record';
import Remix from './pages/Remix';
import Signup from './pages/Signup';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/record" element={
                            <ProtectedRoute>
                                <Record />
                            </ProtectedRoute>
                        } />
                        <Route path="/remix" element={
                            <ProtectedRoute>
                                <Remix />
                            </ProtectedRoute>
                        } />
                        <Route path="/feed" element={
                            <ProtectedRoute>
                                <Feed />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
