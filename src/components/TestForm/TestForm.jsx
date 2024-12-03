import React, { useState, useEffect } from 'react';
import './_TestForm.scss';

const TestForm = ({ addTest, updateTest, deleteTest, editingTest }) => {
    const [name, setName] = useState('');
    const [questions, setQuestions] = useState([{ question: '', answers: [''], correctAnswerIndex: null }]);

    useEffect(() => {
        if (editingTest) {
            setName(editingTest.name);
            setQuestions(editingTest.questions);
        }
    }, [editingTest]);

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
        newQuestions[questionIndex].answers.splice(answerIndex, 1); // Удаляем ответ из массива
        setQuestions(newQuestions);
    };

    const handleRemoveQuestion = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions.splice(questionIndex, 1); // Удаляем вопрос из массива
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].correctAnswerIndex = answerIndex;
        setQuestions(newQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const testData = { name, questions };

        if (!name || questions.some(q => !q.question || q.answers.length === 0 || q.correctAnswerIndex === null)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        if (editingTest) {
            updateTest({ ...testData, id: editingTest.id });
        } else {
            addTest(testData);
        }
        resetForm();
    };

    const handleDeleteTest = () => {
        if (editingTest && editingTest.id) {
            deleteTest(editingTest.id);
            resetForm();
        }
    };

    const resetForm = () => {
        setName('');
        setQuestions([{ question: '', answers: [''], correctAnswerIndex: null }]);
    };

    return (
        <section className="testForm">
            <div className="testForm__container container">
                <form onSubmit={handleSubmit} className="test-form">
                    <input
                        type="text"
                        placeholder="Назва тесту"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="test-form__input test-form__input--name"
                    />
                    {questions.map((q, questionIndex) => (
                        <div key={questionIndex} className="test-form__question">
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
                                className="test-form__input test-form__input--question"
                            />
                            <div className="test-form__answers">
                                {q.answers.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="test-form__answer">
                                        <label className="test-form__answer-label">
                                            <input
                                                type="radio"
                                                name={`correct-answer-${questionIndex}`}
                                                checked={q.correctAnswerIndex === answerIndex}
                                                onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                                                className="test-form__answer-input"
                                            />
                                            Правильна відповідь
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
                                            className="test-form__input test-form__input--answer"
                                        />
                                        <button type="button"
                                                onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}
                                                className="test-form__remove-answer-button">
                                            Видалити відповідь
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleAddAnswer(questionIndex)}
                                        className="test-form__add-answer-button">
                                    Додати відповідь
                                </button>
                            </div>
                            <button type="button" onClick={() => handleRemoveQuestion(questionIndex)}
                                    className="test-form__remove-question-button">
                                Видалити питання
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddQuestion} className="test-form__add-question-button">
                        Додати питання
                    </button>
                    <button type="submit" className="test-form__submit-button">
                        {editingTest ? 'Оновити тест' : 'Додати тест'}
                    </button>
                    {editingTest && (
                        <button type="button" onClick={handleDeleteTest} className="test-form__delete-button">
                            Видалити тест
                        </button>
                    )}
                </form>
            </div>
        </section>
    );
};

export default TestForm;
