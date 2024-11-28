import React, { useState, useRef } from "react";
import axios from "axios";
import "./AddEventPage.css";
import NavBar from "../NavBar";
import { useUser } from "../UserContext";

const AddEventPage = () => {
    const { user } = useUser();
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        location: "",
        price: 0,
        program: "",
        speakers: "",
        organizerId: user.id,
    });

    const [imageUrl, setImageUrl] = useState(""); // Image URL for uploaded image
    const [isUploading, setIsUploading] = useState(false); // Track image upload status
    const [notification, setNotification] = useState(""); // Notification for user feedback

    const fileInputRef = useRef(null); // Use ref for file input to reset it after upload

    // Handle input changes
    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImageUrl(response.data.imageUrl); // Set image URL after upload
        } catch (error) {
            console.error("Помилка завантаження зображення:", error);
            alert("Не вдалося завантажити зображення. Спробуйте ще раз.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset file input field
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageUrl) {
            alert("Будь ласка, завантажте зображення перед додаванням події.");
            return;
        }

        const dataToSend = { ...eventData, image_url: imageUrl };

        try {
            await axios.post("http://localhost:5000/add-event", dataToSend);
            alert("Подію успішно додано! Очікуйте затвердження адміністратора."); // Show notification
            setEventData({
                title: "",
                description: "",
                category: "",
                date: "",
                time: "",
                location: "",
                price: 0,
                program: "",
                speakers: "",
                organizerId: user.id,
            });
            setImageUrl(""); // Reset image URL after submission
        } catch (error) {
            console.error("Помилка додавання події:", error);
            alert("Не вдалося додати подію. Спробуйте ще раз.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="add-event-container">
                <h1>Додати подію</h1>
                {notification && <p className="notification">{notification}</p>} {/* Display notification */}
                <form onSubmit={handleSubmit} className="add-event-form">
                    <div className="form-group">
                        <label>Назва події:</label>
                        <input
                            name="title"
                            value={eventData.title}
                            placeholder="Введіть назву"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Опис:</label>
                        <textarea
                            name="description"
                            value={eventData.description}
                            placeholder="Введіть опис"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Категорія:</label>
                        <input
                            name="category"
                            value={eventData.category}
                            placeholder="Введіть категорію"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Дата:</label>
                        <input
                            name="date"
                            type="date"
                            value={eventData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Час:</label>
                        <input
                            name="time"
                            type="time"
                            value={eventData.time}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Локація:</label>
                        <input
                            name="location"
                            value={eventData.location}
                            placeholder="Введіть місце проведення"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Ціна:</label>
                        <input
                            name="price"
                            type="number"
                            value={eventData.price}
                            placeholder="Введіть ціну"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Програма:</label>
                        <textarea
                            name="program"
                            value={eventData.program}
                            placeholder="Додайте розклад події"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Спікери:</label>
                        <textarea
                            name="speakers"
                            value={eventData.speakers}
                            placeholder="Вкажіть список спікерів"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Завантажити зображення:</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleImageUpload(e)}
                        />
                        {isUploading && <p>Зображення завантажується...</p>}
                        {imageUrl && <p>Зображення завантажено: {imageUrl}</p>}
                    </div>

                    <button type="submit" className="submit-button" disabled={isUploading}>
                        Додати подію
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddEventPage;
