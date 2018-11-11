import React from 'react';

const Folder = ({ name, path, onClick }) => (
	<div className="file folder" onClick={() => onClick(path)}>
		<span className="glyphicon glyphicon-folder-open" />
		{name}
	</div>
);

export default Folder;