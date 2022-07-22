import './App.scss';
import Home from './pages/home/Home';

import
{
  BrowserRouter, Navigate, Route, Routes
} from "react-router-dom";
import NotFound from './pages/404/NotFound';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Watch from './pages/watch/Watch';


function App()
{
  const isUser = false
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={isUser ? <Home /> : <Navigate to="/register" />} />
          <Route path='/login' element={!isUser ? <Login /> : <Navigate to="/" />} />
          <Route path='/register' element={!isUser ? <Register /> : <Navigate to="/" />} />
          <Route path='/movies' element={isUser ? <Home type="movies" /> : <Navigate to="/not-found" />} />
          <Route path='/series' element={isUser ? <Home type="series" /> : <Navigate to="/not-found" />} />
          <Route path='/watch' element={isUser ? <Watch /> : <Navigate to="/not-found" />} />
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
