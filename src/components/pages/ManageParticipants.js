import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import NavBar from "../NavBar";
import "./ManageParticipants.css";

const ManageParticipants = () => {
    const { user } = useUser();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newParticipantEmail, setNewParticipantEmail] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [participantToRemove, setParticipantToRemove] = useState(null);

    useEffect(() => {
        if (user && user.role === "організатор") {
            fetchEvents();
        }
    }, [user]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/events`, {
                params: { organizerId: user.id },
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Помилка завантаження подій:", error);
        }
    };

    const fetchParticipants = async (eventId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/event-participants`, {
                params: { eventId },
            });
            setParticipants(response.data);
        } catch (error) {
            console.error("Помилка завантаження учасників:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEventSelect = (eventId) => {
        setSelectedEvent(eventId);
        fetchParticipants(eventId);
    };

    const handleRemoveParticipant = async () => {
        try {
            await axios.delete(`http://localhost:5000/remove-participant`, {
                data: { participantId: participantToRemove },
            });
            alert("Учасника успішно видалено!");
            fetchParticipants(selectedEvent);
        } catch (error) {
            console.error("Помилка видалення учасника:", error);
            alert("Не вдалося видалити учасника.");
        } finally {
            setShowConfirmModal(false);
            setParticipantToRemove(null);
        }
    };

    const handleAddParticipant = async () => {
        if (!newParticipantEmail) {
            alert("Будь ласка, введіть email учасника.");
            return;
        }
        try {
            await axios.post(`http://localhost:5000/add-participant`, {
                eventId: selectedEvent,
                email: newParticipantEmail,
            });
            alert("Учасника успішно додано!");
            fetchParticipants(selectedEvent);
            setNewParticipantEmail("");
        } catch (error) {
            console.error("Помилка додавання учасника:", error);
            alert("Не вдалося додати учасника.");
        }
    };

    if (!user || user.role !== "організатор") {
        return (
            <div className="manage-container">
                <p>Тільки організатори можуть керувати списком учасників.</p>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <div className="manage-container">
                <h1>Управління учасниками</h1>
                <div className="event-selector">
                    <label>Виберіть подію:</label>
                    <select onChange={(e) => handleEventSelect(e.target.value)}>
                        <option value="">Оберіть подію</option>
                        {events.map((event) => (
                            <option key={event.id} value={event.id}>
                                {event.title}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <p>Завантаження учасників...</p>
                ) : selectedEvent ? (
                    <>
                        <h2>Список учасників</h2>
                        {participants.length > 0 ? (
                            <table className="participants-table">
                                <thead>
                                    <tr>
                                        <th>Ім'я</th>
                                        <th>Email</th>
                                        <th>Дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.map((participant) => (
                                        <tr key={participant.id}>
                                            <td>{participant.name}</td>
                                            <td>{participant.email}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setParticipantToRemove(participant.id);
                                                        setShowConfirmModal(true);
                                                    }}
                                                    className="remove-button"
                                                >
                                                    Видалити
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Немає зареєстрованих учасників.</p>
                        )}

                        <div className="add-participant">
                            <h3>Додати учасника</h3>
                            <div className="add-participant-form">
                                <input
                                    type="email"
                                    placeholder="Введіть email учасника"
                                    value={newParticipantEmail}
                                    onChange={(e) => setNewParticipantEmail(e.target.value)}
                                />
                                <button onClick={handleAddParticipant} className="add-button">
                                    Додати
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Виберіть подію, щоб побачити учасників.</p>
                )}

                {showConfirmModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <p>Ви впевнені, що хочете видалити цього учасника?</p>
                            <div className="modal-buttons">
                                <button onClick={handleRemoveParticipant} className="confirm-button">
                                    Так
                                </button>
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="cancel-button"
                                >
                                    Ні
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageParticipants;
