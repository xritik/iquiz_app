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
const HOST = process.env.REACT_APP_API_URL;

function App() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  // const HOST = `${window.location.protocol}//${window.location.hostname}:5000`;

  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Home HOST={HOST} navigate={navigate} setShowSignUp={setShowSignUp} />} />
        <Route path={'/home'} element={<Home HOST={HOST} navigate={navigate} setShowSignUp={setShowSignUp} />} />
        <Route path={'/login_signUp'} element={<Login_Signup HOST={HOST} navigate={navigate} showSignUp={showSignUp} setShowSignUp={setShowSignUp} />} />
        <Route path={'/adding_iquiz'} element={<IQuizCreationPage HOST={HOST} navigate={navigate} />} />
        <Route path={'/editing_iquiz'} element={<IQuizEditionPage HOST={HOST} navigate={navigate} />} />
        <Route path={'/in-game'} element={<ShowToPlayerPage HOST={HOST} navigate={navigate} />} />
        <Route path={'/question'} element={<QuestionPage HOST={HOST} navigate={navigate} />} />
        <Route path={'/leaderBoard'} element={<LeaderBoard HOST={HOST} navigate={navigate} />} />
        <Route path={'*'} element={<NotFoundPage HOST={HOST} navigate={navigate} />}/>
      </Routes>
    </div>
  );
}

export default App;
