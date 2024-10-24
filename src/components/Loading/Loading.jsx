import React from 'react';
import './_Loading.scss';

const Loading = () => {
	return (
			<div className="wrapper">
				<div className="dot"></div>
				<span className="text">
    Завантаження
  </span>
			</div>
	);
};

export default Loading;