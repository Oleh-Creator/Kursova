import React, { useState, useEffect } from "react";
import { useUser } from "../../UserContext";
import axios from "axios";
import "./UserProfile.css";
import NavBar from "../../NavBar";

const UserProfile = () => {
    const { user, setUser } = useUser();
    const [editable, setEditable] = useState(false);
    const [userDetails, setUserDetails] = useState({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
    });
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    useEffect(() => {
        if (user) {
            setUserDetails(user);
            fetchRegisteredEvents();
        }
    }, [user]);

    const fetchRegisteredEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/user-events`, {
                params: { userId: user.id },
            });
            const currentDate = new Date();
            const events = response.data;

            const past = events.filter((event) => new Date(event.date) < currentDate);
            const upcoming = events.filter((event) => new Date(event.date) >= currentDate);

            setRegisteredEvents(upcoming);
            setPastEvents(past);
        } catch (error) {
            console.error("Помилка завантаження подій:", error);
        }
    };

    const handleEditToggle = () => {
        setEditable(!editable);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/update-user`, {
                id: user.id,
                ...userDetails,
            });
            setUser(response.data);
            alert("Дані профілю успішно оновлено!");
            setEditable(false);
        } catch (error) {
            console.error("Помилка оновлення даних профілю:", error);
            alert("Не вдалося оновити дані профілю.");
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    if (!user) {
        return <div className="profile-container">Будь ласка, увійдіть у систему.</div>;
    }

    return (
        <>
            <NavBar />
            <div className="profile-container">
                <h1>Мій профіль</h1>
                <div className="profile-details">
                    {editable ? (
                        <>
                            <div className="form-group">
                                <label>Ім'я:</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={userDetails.first_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Прізвище:</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={userDetails.last_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userDetails.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Роль:</label>
                                <input type="text" value={user.role} disabled />
                            </div>
                            <button className="save-button" onClick={handleSaveChanges}>
                                Зберегти
                            </button>
                        </>
                    ) : (
                        <>
                            <p>
                                <strong>Ім'я:</strong> {userDetails.first_name}
                            </p>
                            <p>
                                <strong>Прізвище:</strong> {userDetails.last_name}
                            </p>
                            <p>
                                <strong>Email:</strong> {userDetails.email}
                            </p>
                            <p>
                                <strong>Роль:</strong> {userDetails.role}
                            </p>
                            <button className="edit-button" onClick={handleEditToggle}>
                                Редагувати
                            </button>
                        </>
                    )}
                    <button className="logout-button" onClick={handleLogout}>
                        Вийти
                    </button>
                </div>

                <h2>Мої заходи</h2>
                <h3>Зареєстровані події</h3>
                {registeredEvents.length === 0 ? (
                    <p>Ви ще не зареєструвалися на жодну подію.</p>
                ) : (
                    <ul className="event-list">
                        {registeredEvents.map((event) => (
                            <li key={event.id} className="event-item">
                                <h3>{event.title}</h3>
                                <p><strong>Дата:</strong> {new Date(event.date).toLocaleString("uk-UA")}</p>
                                <p><strong>Статус:</strong> {event.status}</p>
                            </li>
                        ))}
                    </ul>
                )}

                <h3>Історія подій</h3>
                {pastEvents.length === 0 ? (
                    <p>У вас ще немає історії минулих подій.</p>
                ) : (
                    <ul className="event-list">
                        {pastEvents.map((event) => (
                            <li key={event.id} className="event-item">
                                <h3>{event.title}</h3>
                                <p><strong>Дата:</strong> {new Date(event.date).toLocaleString("uk-UA")}</p>
                                <p><strong>Статус:</strong> {event.status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default UserProfile;
