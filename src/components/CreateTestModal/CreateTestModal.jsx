import React, { useState } from 'react';
import axios from 'axios';
import './_CreateTestModal.scss';

const CreateTestModal = ({ isOpen, onClose, addTest }) => {
    const [name, setName] = useState('');
    const [questions, setQuestions] = useState([{ question: '', answers: [''], correctAnswerIndex: null, images: [] }]);
    const [files, setFiles] = useState({});

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', answers: [''], correctAnswerIndex: null, images: [] }]);
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

    const handleFileChange = (e, questionIndex) => {
        setFiles({
            ...files,
            [questionIndex]: e.target.files,
        });
    };

    const uploadFiles = async (questionIndex) => {
        if (!files[questionIndex]) return [];

        const formData = new FormData();
        for (const file of files[questionIndex]) {
            formData.append('photos', file);
        }

        try {
            const response = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.files.map(file => file.filename);
        } catch (error) {
            console.error('Error uploading files:', error);
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || questions.some(q => !q.question || q.answers.length === 0 || q.correctAnswerIndex === null)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const updatedQuestions = await Promise.all(questions.map(async (q, index) => {
            const uploadedFiles = await uploadFiles(index);
            return { ...q, images: uploadedFiles };
        }));

        const testData = { name, questions: updatedQuestions };
        addTest(testData);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setName('');
        setQuestions([{ question: '', answers: [''], correctAnswerIndex: null, images: [] }]);
        setFiles({});
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose} className="modal__close-button">&times;</button>
                <form onSubmit={handleSubmit} className="modal__form">
                    <input
                        type="text"
                        placeholder="Test Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="modal__input modal__input--name"
                    />
                    {questions.map((q, questionIndex) => (
                        <div key={questionIndex} className="modal__question">
                            <input
                                type="text"
                                placeholder="Question"
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
                                            Correct Answer
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={`Answer ${String.fromCharCode(65 + answerIndex)}`}
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
                                            Remove Answer
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddAnswer(questionIndex)}
                                    className="modal__add-answer-button"
                                >
                                    Add Answer
                                </button>
                            </div>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange(e, questionIndex)}
                                className="modal__file-input"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveQuestion(questionIndex)}
                                className="modal__remove-question-button"
                            >
                                Remove Question
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="modal__add-question-button"
                    >
                        Add Question
                    </button>
                    <button type="submit" className="modal__submit-button">
                        Create Test
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTestModal;
