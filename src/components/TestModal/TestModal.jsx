import React, { useState, useEffect } from 'react';
import './_TestModal.scss';

const TestModal = ({ isOpen, onRequestClose, test }) => {
    if (!test || !Array.isArray(test.questions)) {
        return <div>Ошибка: данные теста недоступны или имеют неправильный формат.</div>;
    }

    const [answers, setAnswers] = useState(Array(test.questions.length).fill(null));
    const [results, setResults] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setStartTime(new Date()); // Устанавливаем время начала
        }
    }, [isOpen]);

    const handleAnswerChange = (questionIndex, answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const endTime = new Date();
        const duration = Math.floor((endTime - startTime) / 1000); // Рассчитываем длительность
        setElapsedTime(duration);

        const correctAnswers = test.questions.map((q) => q.correctAnswerIndex);
        const results = answers.map((answer, index) => ({
            question: test.questions[index].question,
            userAnswer: answer !== null ? test.questions[index].answers[answer] : 'Немає відповіді',
            correctAnswer: correctAnswers[index] !== undefined ? test.questions[index].answers[correctAnswers[index]] : 'Немає відповіді',
            isCorrect: answer === correctAnswers[index],
        }));

        setResults(results);
        setIsSubmitted(true);
    };

    const calculateSuccessRate = () => {
        const correctCount = results.filter(result => result.isCorrect).length;
        return ((correctCount / test.questions.length) * 100).toFixed(2);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onRequestClose} className="modal__close-button">
                    &times;
                </button>

                <h2 className="modal__title">{test.name}</h2>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="modal__form">
                        {test.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="modal__question">
                                <p className="modal__question-text">{question.question}</p>
                                {question.answers.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="modal__answer">
                                        <label className="modal__answer-label">
                                            <input
                                                type="radio"
                                                name={`question-${questionIndex}`}
                                                value={answerIndex}
                                                checked={answers[questionIndex] === answerIndex}
                                                onChange={() => handleAnswerChange(questionIndex, answerIndex)}
                                                className="modal__answer-input"
                                            />
                                            <p className="modal__answer-text">{answer}</p>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button type="submit" className="modal__submit-button">Відправити</button>
                    </form>
                ) : (
                    <div className="modal__results">
                        <h3 className="modal__results-title">Результати</h3>
                        <p className="modal__success-rate">Показник успішності: {calculateSuccessRate()}%</p>
                        {elapsedTime !== null && (
                            <p className="modal__elapsed-time">
                                Ви пройшли тест за <span>{Math.floor(elapsedTime / 60)}</span> хвилин <span>{elapsedTime % 60}</span> секунд.
                            </p>
                        )}
                        <ul className="modal__results-list">
                            {results.map((result, index) => (
                                <li key={index} className="modal__result-item">
                                    <strong className="modal__result-question">Питання:</strong>
                                    <span className="modal__question-text">{result.question}</span>
                                    <br />
                                    <strong className="modal__result-user-answer">Ваша відповідь:</strong>
                                    <span className="modal__user-answer">{result.userAnswer}</span>
                                    <br />
                                    <strong className="modal__result-correct-answer">Правильна відповідь:</strong>
                                    <span className="modal__correct-answer">{result.correctAnswer}</span>
                                    <br />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestModal;
