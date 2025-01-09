import { Route, Routes, useNavigate } from "react-router-dom";
import  Game  from './components/Game.js';
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Game navigate={navigate} setShowSignUp={setShowSignUp} />} />
        <Route path={'/game'} element={<Game navigate={navigate} setShowSignUp={setShowSignUp} />} />
      </Routes>
    </div>
  );
}

export default App;
