import React from 'react';
import './_TestList.scss';

const TestList = ({ tests, deleteTest, openModal }) => {
    return (
        <div className="test-list">
            <div className="test-list__container container">
                <ul className="test-list__items">
                    {tests.map((test) => (
                        <li key={test.id} className="test-list__item">
                            <span
                                onClick={() => openModal(test)}
                                className="test-list__item-name"
                                style={{ cursor: 'pointer', color: 'blue' }}
                            >
                                {test.name}
                            </span>
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
