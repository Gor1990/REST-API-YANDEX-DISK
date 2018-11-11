export const setToken = token => ({
	type: 'SET_TOKEN',
	token,
});

export const setDirectory = (path, files) => ({
	type: 'SET_DIRECTORY',
	path,
	files,
});

export const setLoading = () => ({
	type: 'SET_LOADING',
});