import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainApp from './Pages/MainApp';
import Result from './Pages/Result';

function App() {

  return (
    <>
      <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainApp />} />
          <Route path="/result" element={<Result />} />

          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
      </div>
    </>
  )
}

export default App
