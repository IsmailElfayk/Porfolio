import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home              from './pages/Home';
import Projects          from './pages/Projects';
import ProjectDetail     from './pages/ProjectDetail';
import PaperDetail       from './pages/PaperDetail';
import PostDetail        from './pages/PostDetail';
import About             from './pages/About';
import Contact           from './pages/Contact';
import Blog              from './pages/Blog';
import Research          from './pages/Research';
import Playground        from './pages/Playground';
import ThemeDetailPage   from './pages/ThemeDetailPage';
import SectionItemDetail from './pages/SectionItemDetail';
import NotFound          from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/projects"       element={<Projects />} />
        <Route path="/projects/:id"   element={<ProjectDetail />} />
        <Route path="/papers/:id"     element={<PaperDetail />} />
        <Route path="/writing/:id"    element={<PostDetail />} />
        <Route path="/about"          element={<About />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/writing"        element={<Blog />} />
        <Route path="/research"       element={<Research />} />
        <Route path="/playground"     element={<Playground />} />
        <Route path="/themes/:slug"   element={<ThemeDetailPage />} />
        <Route path="/sections/:id"   element={<SectionItemDetail />} />
        <Route path="/resume"         element={<About />} />
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
