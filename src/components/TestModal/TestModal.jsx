// TestModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import './_TestModal.scss';

const TestModal = ({ isOpen, onRequestClose, test }) => {
    const user = useSelector(state => state.auth.user);
    const [answers, setAnswers] = useState(Array(test.questions.length).fill(null));
    const [results, setResults] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setStartTime(new Date());
        }
    }, [isOpen]);

    const handleAnswerChange = (questionIndex, answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.uid) {
            toast.error('Пользователь не авторизован');
            return;
        }

        const endTime = new Date();
        const duration = Math.floor((endTime - startTime) / 1000);
        const correctAnswers = test.questions.map(q => q.correctAnswerIndex);
        const results = answers.map((answer, index) => ({
            question: test.questions[index].question,
            userAnswer: answer !== null ? test.questions[index].answers[answer] : 'No answer',
            correctAnswer: correctAnswers[index] !== undefined ? test.questions[index].answers[correctAnswers[index]] : 'No answer',
            isCorrect: answer === correctAnswers[index],
        }));

        setResults(results);
        setIsSubmitted(true);

        const correctCount = results.filter(result => result.isCorrect).length;
        const score = ((correctCount / test.questions.length) * 100).toFixed(2);

        try {
            await axios.post('http://localhost:3000/test-results', {
                userId: user.uid,
                testId: test.id,
                testName: test.name,
                score: parseFloat(score),
                totalQuestions: test.questions.length,
                timeTaken: duration
            });
            toast.success('Результати тесту збережено');
        } catch (error) {
            console.error('Error saving test results:', error);
            toast.error('Помилка при збереженні результатів тесту');
        }
    };

    const calculateSuccessRate = () => {
        const correctCount = results.filter(result => result.isCorrect).length;
        return ((correctCount / test.questions.length) * 100).toFixed(2);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onRequestClose} className="modal__close-button">&times;</button>
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
                                <div className="modal__images">
                                    {question.images && question.images.map((image, imageIndex) => (
                                        <img
                                            key={imageIndex}
                                            src={`http://localhost:3000/uploads/${image}`}
                                            alt={`Question ${questionIndex + 1} Image ${imageIndex + 1}`}
                                            className="modal__question-image"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button type="submit" className="modal__submit-button">Submit</button>
                    </form>
                ) : (
                    <div className="modal__results">
                        <h3 className="modal__results-title">Результати</h3>
                        <p className="modal__success-rate">Відсоток успішності: {calculateSuccessRate()}%</p>
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
