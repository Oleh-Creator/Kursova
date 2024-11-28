import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";
import NavBar from "../NavBar";

const AdminPanel = () => {
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const eventsResponse = await axios.get("http://localhost:5000/admin/events");
            const usersResponse = await axios.get("http://localhost:5000/admin/users");
            setEvents(eventsResponse.data);
            setUsers(usersResponse.data);
        } catch (error) {
            console.error("Помилка завантаження даних:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/admin/event/delete/${id}`);
            setEvents(events.filter((event) => event.id !== id));
            alert("Подію успішно видалено!");
        } catch (error) {
            console.error("Помилка видалення події:", error);
        }
    };

    const handleApproveEvent = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin/event/approve/${id}`);
            setEvents(events.map((event) => (event.id === id ? { ...event, status: "approved" } : event)));
            alert("Подію успішно затверджено!");
        } catch (error) {
            console.error("Помилка затвердження події:", error);
        }
    };

    const handleBlockUser = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin/user/block/${id}`);
            setUsers(users.map((user) => (user.id === id ? { ...user, status: "blocked" } : user)));
            alert("Користувача заблоковано!");
        } catch (error) {
            console.error("Помилка блокування користувача:", error);
        }
    };

    const handleMakeOrganizer = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin/user/organizer/${id}`);
            setUsers(users.map((user) => (user.id === id ? { ...user, role: "організатор" } : user)));
            alert("Користувач став організатором!");
        } catch (error) {
            console.error("Помилка надання прав організатора:", error);
        }
    };

    const handleMakeParticipant = async (id) => {
        try {
            await axios.put(`http://localhost:5000/admin/user/participant/${id}`);
            setUsers(users.map((user) => (user.id === id ? { ...user, role: "учасник" } : user)));
            alert("Користувач став учасником!");
        } catch (error) {
            console.error("Помилка надання прав учасника:", error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="admin-panel">
                <h1>Адміністративна панель</h1>
                {loading ? (
                    <p>Завантаження...</p>
                ) : (
                    <>
                        <div className="section">
                            <h2>Керування подіями</h2>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Назва</th>
                                        <th>Категорія</th>
                                        <th>Дата</th>
                                        <th>Статус</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event.id}>
                                            
                                            <td>{event.title}</td>
                                            <td>{event.category}</td>
                                            <td>{new Date(event.date).toLocaleDateString("uk-UA")}</td>
                                            <td>{event.status}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleApproveEvent(event.id)}
                                                    className="approve-button"
                                                >
                                                    Затвердити
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="delete-button"
                                                >
                                                    Видалити
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="section">
                            <h2>Керування користувачами</h2>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Ім'я</th>
                                        <th>Прізвище</th>
                                        <th>Email</th>
                                        <th>Роль</th>
                                        <th>Статус</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {console.log(users)}
                                    {users.map((user) => (
                                     
                                        <tr key={user.id}>
                                            <td>{user.first_name}</td>
                                            <td>{user.last_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>{user.isBlocked === 1 ? "Заблокований" : "Активний"}</td>

                                            <td>
                                                {user.isBlocked !== 1 && (
                                                    <button
                                                        onClick={() => handleBlockUser(user.id)}
                                                        className="block-button"
                                                    >
                                                        Заблокувати
                                                    </button>
                                                )}
                                                {user.role !== "організатор" && (
                                                    <button
                                                        onClick={() => handleMakeOrganizer(user.id)}
                                                        className="organizer-button"
                                                    >
                                                        Зробити організатором
                                                    </button>
                                                )}
                                                {user.role !== "учасник" && (
                                                    <button
                                                        onClick={() => handleMakeParticipant(user.id)}
                                                        className="participant-button"
                                                    >
                                                        Зробити учасником
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default AdminPanel;
