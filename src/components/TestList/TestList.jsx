import React from 'react';
import './_TestList.scss';

const TestList = ({tests, deleteTest, setEditingTest, openModal}) => {
    return (
        <div className="test-list">
            <div className="test-list__container container">
                <h2 className="test-list__title">Список тестів</h2>
                <ul className="test-list__items">
                    {tests.map((test) => (
                        <li key={test.id} className="test-list__item">
                <span
                    onClick={() => openModal(test)}
                    className="test-list__item-name"
                    style={{cursor: 'pointer', color: 'blue'}}
                >
                    {test.name}
                </span>
                            <button
                                onClick={() => setEditingTest(test)}
                                className="test-list__edit-button"
                            >
                                Змінити
                            </button>
                            <button
                                onClick={() => deleteTest(test.id)}
                                className="test-list__delete-button"
                            >
                                Видалити
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TestList;
