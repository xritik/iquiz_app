import { Route, Routes, useNavigate } from "react-router-dom";
import  Home  from './components/Home.js';
import Login_Signup  from './components/Login_Signup.js';
import Dashboard from './components/Dashboard.js';
import { useState } from "react";
import PlayingGameUserPage from "../../player_side/src/components/PlayingGameUserPage.js";

function App() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Home navigate={navigate} setShowSignUp={setShowSignUp} />} />
        <Route path={'/home'} element={<Home navigate={navigate} setShowSignUp={setShowSignUp} />} />
        <Route path={'/login_signUp'} element={<Login_Signup navigate={navigate} showSignUp={showSignUp} setShowSignUp={setShowSignUp} />} />
        <Route path={'/dashboard'} element={ <Dashboard navigate={navigate} /> }/>
        <Route path={'/in_game'} element={ <PlayingGameUserPage navigate={navigate} /> } />
      </Routes>
    </div>
  );
}

export default App;
