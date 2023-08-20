import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chatroom from "./pages/Chatroom";
import ChatUsers from "./pages/ChatUsers";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import UserPage from "./pages/UserPage";
import CustomErrorBoundary from "./pages/CustomErrorBoundary";
import BandPage from "./pages/BandPage";

function App() {
    return (
        <CustomErrorBoundary>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<Home />} />
                        <Route path="home" element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="chat" element={<ChatUsers />} />
                        <Route path="chat/:room" element={<Chatroom />} />
                        <Route path="user" element={<UserPage />} />
                        <Route path="bandpage" element={<BandPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CustomErrorBoundary>
    );
}

export default App;
