import React, { useEffect, useState } from 'react';
import TestForm from "@/components/TestForm/TestForm.jsx";
import TestList from "@/components/TestList/TestList.jsx";
import TestModal from "@/components/TestModal/TestModal.jsx";
import axios from "axios";
import Header from "@/components/Header/Header.jsx";

const Testing = () => {
    const [tests, setTests] = useState([]);
    const [editingTest, setEditingTest] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentTest, setCurrentTest] = useState(null);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        const response = await axios.get('http://localhost:3000/tests');
        setTests(response.data);
    };

    const addTest = async (newTest) => {
        await axios.post('http://localhost:3000/tests', newTest);
        fetchTests();
    };

    const updateTest = async (updatedTest) => {
        await axios.put(`http://localhost:3000/tests/${updatedTest.id}`, updatedTest);
        fetchTests();
        setEditingTest(null);
    };

    const deleteTest = async (id) => {
        await axios.delete(`http://localhost:3000/tests/${id}`);
        fetchTests();
    };

    const openModal = (test) => {
        setCurrentTest(test);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentTest(null);
    };

    return (
        <>
            <Header/>
            <TestForm
                addTest={addTest}
                updateTest={updateTest}
                deleteTest={deleteTest}
                editingTest={editingTest}
            />
            <TestList
                tests={tests}
                deleteTest={deleteTest}
                setEditingTest={setEditingTest}
                openModal={openModal}
            />
            {currentTest && (
                <TestModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    test={currentTest}
                />
            )}
        </>
    );
};

export default Testing;
