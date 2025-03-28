import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import  Home  from './components/Home.js';
import Login_Signup  from './components/Login_Signup.js';
import IQuizCreationPage from "./components/IQuizCreationPage.js";
import IQuizEditionPage from "./components/IQuizEditionPage.js";
import NotFoundPage from "./components/NotFoundPage.js";
import ShowToPlayerPage from "./components/ShowToPlayerPage.js";
import QuestionPage from "./components/QuestionPage.js";
import LeaderBoard from "./components/LeaderBoard.js";

function App() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const hostName = `${window.location.hostname}`;
  // const hostName = '192.168.221.96'; 

  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Home hostName={hostName} navigate={navigate} setShowSignUp={setShowSignUp} />} />
        <Route path={'/home'} element={<Home hostName={hostName} navigate={navigate} setShowSignUp={setShowSignUp} />} />
        <Route path={'/login_signUp'} element={<Login_Signup hostName={hostName} navigate={navigate} showSignUp={showSignUp} setShowSignUp={setShowSignUp} />} />
        <Route path={'/adding_iquiz'} element={<IQuizCreationPage hostName={hostName} navigate={navigate} />} />
        <Route path={'/editing_iquiz'} element={<IQuizEditionPage hostName={hostName} navigate={navigate} />} />
        <Route path={'/in-game'} element={<ShowToPlayerPage hostName={hostName} navigate={navigate} />} />
        <Route path={'/question'} element={<QuestionPage hostName={hostName} navigate={navigate} />} />
        <Route path={'/leaderBoard'} element={<LeaderBoard hostName={hostName} navigate={navigate} />} />
        <Route path={'*'} element={<NotFoundPage hostName={hostName} navigate={navigate} />}/>
      </Routes>
    </div>
  );
}

export default App;
