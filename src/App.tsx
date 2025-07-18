import { BrowserRouter as Router, Routes, Route } from "react-router";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { AuthContextProvider } from "./Contexts/AuthContext";
import PostPage from "./Pages/PostPage";
import Layout from "./Layouts/Layout";
import UserProfilePage from "./Pages/UserProfilePage";
import ProtectedRoute from "./Layouts/ProtectedRoute";
import EditProfilePage from "./Pages/EditProfilePage";
import NotificationsPage from "./Pages/NotificationsPage";
import SearchPage from "./Pages/SearchPage";
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import LoginDialogLayout from "./Layouts/LoginDialogLayout";

export const API_URL = import.meta.env.VITE_API_URL as string;

function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
          <LoginDialogLayout>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route
                  path="/user/:userId/profile"
                  element={<UserProfilePage />}
                />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/signin" element={<LoginPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/user/profile/edit"
                    element={<EditProfilePage />}
                  />
                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                </Route>
              </Route>

              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Routes>
          </LoginDialogLayout>
        </AuthContextProvider>
      </Router>
    </>
  );
}

export default App;
