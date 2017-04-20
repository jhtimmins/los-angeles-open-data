class Base {
	init() {
		$("#logo").on("click", function() {
			window.location = '/';
		})

		$("#departments").on("click", function() {
			window.location = '/departments';
		})

		$("#mayor").on("click", function() {
			window.location = '/mayor';
		})

		$("#data").on("click", function() {
			window.location = 'https://data.lacity.org/browse?q=budget&sortBy=relevance&utf8=%E2%9C%93';
		})
	}
}