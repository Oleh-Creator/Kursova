import { useState } from "react";
import { Link } from "react-router-dom";
import './RegisterPage.css'; 
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("учасник");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            first_name: name,
            last_name: surname,
            email,
            password,
            role,
        };

        try {
            const response = await axios.post("http://localhost:5000/add-user", userData);
            alert("Користувача успішно зареєстровано!");
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Ця електронна пошта вже зареєстрована.");
            } else if (error.response) {
                alert(`Помилка сервера: ${error.response.data.message || "Сталася невідома помилка."}`);
            } else {
                alert("Не вдалося зареєструвати користувача. Перевірте з'єднання з сервером.");
            }
        }
    };

    return (
        <div className="register-container">
            <h1>Реєстрація</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="i_name">Ім'я</label>
                    <input
                        type="text"
                        id="i_name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введіть ваше ім'я"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="i_surname">Прізвище</label>
                    <input
                        type="text"
                        id="i_surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder="Введіть ваше прізвище"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="i_email">Електронна пошта</label>
                    <input
                        type="email"
                        id="i_email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="i_password">Пароль</label>
                    <input
                        type="password"
                        id="i_password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введіть ваш пароль"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="i_role">Роль</label>
                    <select
                        id="i_role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="учасник">учасник</option>
                        <option value="організатор">організатор</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">
                    Зареєструватися
                </button>
            </form>
            <div className="already-have-account">
                Вже маєте акаунт? <Link to="/login">Увійти</Link>
            </div>
        </div>
    );
}
