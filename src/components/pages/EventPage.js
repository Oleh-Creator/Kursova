import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventPage.css";
import NavBar from "../NavBar";
import { useUser } from "../UserContext";

const EventPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const { user } = useUser(); // Отримуємо інформацію про користувача з контексту

    useEffect(() => {
        // Отримати деталі події
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Помилка завантаження події:", error);
            }
        };
        fetchEventDetails();
    }, [id]);

    const handleRegister = async () => {
        try {
            await axios.post(`http://localhost:5000/register`, {
                userId: user.id, // ID користувача з контексту
                eventId: id,
                status: "заброньовано", // Заміна на статус із вашої бази
            });
            alert("Ви успішно зареєструвалися на подію!");
        } catch (error) {
            console.error("Помилка реєстрації:", error);
            alert("Не вдалося зареєструватися.");
        }
    };

    const handlePurchase = async () => {
        try {
            await axios.post(`http://localhost:5000/register`, {
                userId: user.id, // ID користувача з контексту
                eventId: id,
                status: "придбано", // Статус "придбано" з бази даних
            });
            alert("Ви успішно придбали квиток на подію!");
        } catch (error) {
            console.error("Помилка придбання:", error);
            alert("Не вдалося придбати квиток.");
        }
    };

    if (!event) return <div className="loading">Завантаження...</div>;

    return (
        <> 
            <NavBar />
            <div className="event-page">
            <div className="event-image">
        {console.log(event.image_url)}
    <img src={event.image_url} alt={event.title} />
    </div>
                <div className="event-header">
                    <h1>{event.title}</h1>
                    <p className="event-category">{event.category.toUpperCase()}</p>
                </div>
                <div className="event-details">
    <p>
        <strong>Опис:</strong> {event.description}
    </p>
    <p>
        <strong>Дата:</strong> {new Date(event.date).toLocaleDateString()}
    </p>
    <p>
        <strong>Час:</strong> {event.time}
    </p>
    <p>
        <strong>Місце:</strong> {event.location}
    </p>
    <p>
        <strong>Ціна квитка:</strong> {event.price} грн
    </p>
    <p>
        <strong>Програма:</strong> {event.program}
    </p>
    <p>
        <strong>Спікери/Виступи:</strong> {event.speakers}
    </p>
</div>

                <div className="event-actions">
                    <button onClick={handleRegister} className="register-button">
                        Зареєструватися
                    </button>
                    <button onClick={handlePurchase} className="purchase-button">
                        Купити
                    </button>
                </div>
            </div>
        </>
    );
};

export default EventPage;
