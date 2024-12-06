import React, {useEffect, useState} from 'react';
import TestList from "@/components/TestList/TestList.jsx";
import TestModal from "@/components/TestModal/TestModal.jsx";
import CreateTestModal from "@/components/CreateTestModal/CreateTestModal.jsx";
import axios from "axios";
import Header from "@/components/Header/Header.jsx";
import {toast} from 'react-toastify';

const Testing = () => {
    const [tests, setTests] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentTest, setCurrentTest] = useState(null);
    const [createTestModalOpen, setCreateTestModalOpen] = useState(false);
    const [testCode, setTestCode] = useState(''); // Состояние для хранения кода теста
    const [foundTest, setFoundTest] = useState(null); // Состояние для найденного теста

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        const response = await axios.get('http://localhost:3000/tests');
        setTests(response.data);
    };

    const addTest = async (newTest) => {
        try {
            await axios.post('http://localhost:3000/tests', newTest);
            fetchTests();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Произошла ошибка при создании теста.');
            }
        }
    };

    const deleteTest = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/tests/${id}`);
            fetchTests();
        } catch (error) {
            console.error('Ошибка при удалении теста:', error);
        }
    };

    const openModal = (test) => {
        setCurrentTest(test);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentTest(null);
    };

    const openCreateTestModal = () => {
        setCreateTestModalOpen(true);
    };

    const closeCreateTestModal = () => {
        setCreateTestModalOpen(false);
    };

    const handleSearchTest = async () => {
        const found = tests.find(test => test.code === testCode);
        if (found) {
            setCurrentTest(found);
            setModalIsOpen(true); // Открываем модальное окно с найденным тестом
        } else {
            toast.error('Тест с таким кодом не найден.'); // Уведомление, если тест не найден
        }
    };

    return (
        <>
            <Header/>
            <div className="test-header">
                <h2 className="test-list__title">Список тестів</h2>
                <button
                    className="create-test-button"
                    onClick={openCreateTestModal}
                >
                    Створити тест
                </button>
            </div>
            <div className="search-test">
                <input
                    type="text"
                    placeholder="Введите код теста"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                />
                <button onClick={handleSearchTest}>Продолжить</button>
            </div>
            <TestList
                tests={tests}
                deleteTest={deleteTest}
                openModal={openModal}
            />
            {currentTest && (
                <TestModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    test={currentTest}
                />
            )}
            {createTestModalOpen && (
                <CreateTestModal
                    isOpen={createTestModalOpen}
                    onClose={closeCreateTestModal}
                    addTest={addTest}
                    existingTests={tests}
                />
            )}
            {foundTest && (
                <TestModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    test={foundTest}
                />
            )}
        </>
    );
};

export default Testing;
