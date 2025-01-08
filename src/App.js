import { Route, Routes, useNavigate } from "react-router-dom";
import  Home  from './components/Home.js'
import Login_Signup  from './components/Login_Signup.js'

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Home navigate={navigate} />} />
        <Route path={'/login_signUp'} element={<Login_Signup navigate={navigate} />} />
      </Routes>
    </div>
  );
}

export default App;
