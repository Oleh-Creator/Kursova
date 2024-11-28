import React, { useEffect, useState } from "react";
import NavBar from "../../NavBar";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filterOptions, setFilterOptions] = useState({ categories: [], locations: [] });
    const [filter, setFilter] = useState({ category: "", date: "", location: "" });

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filter, events]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/events");
            // Filter events with status "approved"
            const approvedEvents = response.data.filter((event) => event.status === "approved");
            setEvents(approvedEvents);

            // Dynamically extract categories and locations for filters
            const categories = [...new Set(approvedEvents.map((event) => event.category))];
            const locations = [...new Set(approvedEvents.map((event) => event.location))];
            setFilterOptions({ categories, locations });
        } catch (error) {
            console.error("Помилка завантаження подій:", error);
        }
    };

    const applyFilters = () => {
        let filtered = events;

        if (filter.category) {
            filtered = filtered.filter((event) => event.category === filter.category);
        }

        if (filter.location) {
            filtered = filtered.filter((event) => event.location === filter.location);
        }

        if (filter.date === "weekdays") {
            filtered = filtered.filter((event) => {
                const day = new Date(event.date).getDay();
                return day >= 1 && day <= 5; // Monday-Friday
            });
        } else if (filter.date === "weekend") {
            filtered = filtered.filter((event) => {
                const day = new Date(event.date).getDay();
                return day === 0 || day === 6; // Saturday-Sunday
            });
        }

        setFilteredEvents(filtered);
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <>
            <NavBar />
            <div className="homepage-container">
                <div className="homepage">
                    <h1 className="homepage-title">Майбутні заходи</h1>
                    <div className="filters">
                        <select name="category" onChange={handleFilterChange}>
                            <option value="">Будь-яка категорія</option>
                            {filterOptions.categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <select name="date" onChange={handleFilterChange}>
                            <option value="">Будь-який день</option>
                            <option value="weekdays">Будні дні</option>
                            <option value="weekend">Вихідні</option>
                        </select>
                        <select name="location" onChange={handleFilterChange}>
                            <option value="">Будь-яке місце</option>
                            {filterOptions.locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="events-grid">
                        {filteredEvents.length === 0 ? (
                            <p>Немає подій, які відповідають фільтрам</p>
                        ) : (
                            filteredEvents.map((event) => (
                                <div className="event-card" key={event.id}>
                                    <div className="event-image">
                                        <img src={event.image_url} alt={event.title} />
                                    </div>
                                    <div className="event-content">
                                        <h3 className="event-title">{event.title}</h3>
                                        <p className="event-description">{event.description}</p>
                                        <p className="event-meta">
                                            <span>{formatDateTime(event.date)}</span> — <span>{event.location}</span>
                                        </p>
                                        <button
                                            onClick={() =>
                                                (window.location.href = `/event/${event.id}`)
                                            }
                                            className="details-button"
                                        >
                                            Переглянути деталі заходу
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
