import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import News from '@/pages/News';
import NewsEditor from '@/pages/NewsEditor';
import Categories from '@/pages/Categories';
import Users from '@/pages/Users';
import NotFound from '@/pages/NotFound';
import VideosPage from "@/pages/Videos";
import VideoEditor from "@/pages/VideoEditor";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/new" element={<NewsEditor />} />
            <Route path="/news/edit/:id" element={<NewsEditor />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/users" element={<Users />} />
            <Route path="/analytics" element={<div />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/videos/new" element={<VideoEditor />} />
            <Route path="/videos/edit/:id" element={<VideoEditor />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;