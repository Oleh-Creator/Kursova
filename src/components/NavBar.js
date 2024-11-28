import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
import "./NavBar.css";

const NavBar = () => {
    const { user, setUser } = useUser();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <nav className="navbar">
            {/* Логотип */}
            <Link to="/" className="navbar-logo">
            Заходи
            </Link>

            {/* Список меню */}
            <ul className="navbar-menu">
                <li>
                    <Link to="/">Головна</Link>
                </li>
                {user?.role === "організатор" && (
                    <li>
                        <Link to="/organizer">Панель організатора</Link>
                    </li>
                    
                )}
                   {user?.role === "організатор" && (
                    <li>
                        <Link to="/organizer_events">Мої івенти</Link>
                    </li>
                    
                )}
                {user?.role === "адміністратор" && (
                    <li>
                        <Link to="/admin">Панель адміністратора</Link>
                    </li>
                )}
            </ul>


<div className="navbar-right">
    {user ? (
        <>
            <Link to="/profile" className="profile-link">
                <img
                    src="/icons/profile-icon.svg" // Шлях до іконки в папці public
                    alt="Профіль"
                    className="profile-icon"
                />
                {user.first_name}
            </Link>
          
        </>
    ) : (
        <>
            <Link to="/login">Вхід</Link>
            <Link to="/register">Реєстрація</Link>
        </>
    )}
</div>

        </nav>
    );
};

export default NavBar;
