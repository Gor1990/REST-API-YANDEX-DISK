import React from 'react';

const File = ({ name }) => (
	<div className="file">
		<span className="glyphicon glyphicon-file" />
		{name}
	</div>
);

export default File;