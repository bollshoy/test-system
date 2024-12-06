import React, { useState } from 'react';
import './_CreateTestModal.scss'; // Стилей для модального окна

const CreateTestModal = ({ isOpen, onClose, addTest }) => {
    const [name, setName] = useState('');  // Стейт для имени теста
    const [questions, setQuestions] = useState([{ question: '', answers: [''], correctAnswerIndex: null }]);  // Стейт для вопросов теста

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', answers: [''], correctAnswerIndex: null }]);
    };

    const handleAddAnswer = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].answers.push('');
        setQuestions(newQuestions);
    };

    const handleRemoveAnswer = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.splice(answerIndex, 1);
        setQuestions(newQuestions);
    };

    const handleRemoveQuestion = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions.splice(questionIndex, 1);
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].correctAnswerIndex = answerIndex;
        setQuestions(newQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || questions.some(q => !q.question || q.answers.length === 0 || q.correctAnswerIndex === null)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const testData = { name, questions };
        addTest(testData);  // Добавление нового теста через колбэк
        resetForm();  // Сброс формы
        onClose();  // Закрытие модального окна
    };

    const resetForm = () => {
        setName('');
        setQuestions([{ question: '', answers: [''], correctAnswerIndex: null }]);
    };

    if (!isOpen) return null;  // Если модальное окно не открыто, не рендерим его

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose} className="modal__close-button">&times;</button>
                <form onSubmit={handleSubmit} className="modal__form">
                    <input
                        type="text"
                        placeholder="Название теста"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="modal__input modal__input--name"
                    />
                    {questions.map((q, questionIndex) => (
                        <div key={questionIndex} className="modal__question">
                            <input
                                type="text"
                                placeholder="Питання"
                                value={q.question}
                                onChange={(e) => {
                                    const newQuestions = [...questions];
                                    newQuestions[questionIndex].question = e.target.value;
                                    setQuestions(newQuestions);
                                }}
                                required
                                className="modal__input modal__input--question"
                            />
                            <div className="modal__answers">
                                {q.answers.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="modal__answer">
                                        <label className="modal__answer-label">
                                            <input
                                                type="radio"
                                                name={`correct-answer-${questionIndex}`}
                                                checked={q.correctAnswerIndex === answerIndex}
                                                onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                                                className="modal__answer-input"
                                            />
                                            Вірна відповідь
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={`Відповідь ${String.fromCharCode(65 + answerIndex)}`}
                                            value={answer}
                                            onChange={(e) => {
                                                const newQuestions = [...questions];
                                                newQuestions[questionIndex].answers[answerIndex] = e.target.value;
                                                setQuestions(newQuestions);
                                            }}
                                            required
                                            className="modal__input modal__input--answer"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}
                                            className="modal__remove-answer-button"
                                        >
                                            Видалити відповідь
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddAnswer(questionIndex)}
                                    className="modal__add-answer-button"
                                >
                                    Додати відповідь
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveQuestion(questionIndex)}
                                className="modal__remove-question-button"
                            >
                                Видалити питання
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="modal__add-question-button"
                    >
                        Додати питання
                    </button>
                    <button type="submit" className="modal__submit-button">
                        Створити тест
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTestModal;
