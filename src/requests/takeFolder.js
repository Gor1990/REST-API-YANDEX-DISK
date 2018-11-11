export default function takeFolder(token, path) {
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `OAuth ${token}`
	  });

	return fetch(`https://cloud-api.yandex.net/v1/disk/resources?path=${path}&limit=1000`, {
		headers
	}).then(response => {
		if (response.status === 200) {
			return response.json();
		} else {
			throw new Error('error with API!');
		}
	});
}
