import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../components/pages/home/HomePage";
import EventPage from "../components/pages/EventPage";
import UserProfile from "../components/pages/user/UserProfile";

import AdminPanel from "../components/pages/AdminPanel";

import RegisterPage from "../components/pages/register/RegisterPage";
import LoginPage from "../components/pages/login/LoginPage";
import PrivateRoute from "./PrivateRoute";
import NavBar from "./NavBar";
import AddEventPage from "./pages/AddEventPage";
import ManageParticipants from "./pages/ManageParticipants";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Публічні маршрути */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Приватні маршрути (захищені сторінки) */}
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/event/:id"
                element={
                    <PrivateRoute>
                        <EventPage />
                    </PrivateRoute>
                }
            />
              <Route
                path="/home"
                element={
                    <PrivateRoute>
                        
                        <HomePage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <UserProfile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/organizer"
                element={
                    <PrivateRoute>
                        
                        <AddEventPage />
                      
                    </PrivateRoute>
                }
            />
                <Route
                path="/organizer_events"
                element={
                    <PrivateRoute>
                        
                       
                        <ManageParticipants/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <PrivateRoute>
                        <AdminPanel />
                    </PrivateRoute>
                }
            />
           
        </Routes>
    );
};

export default AppRoutes;
