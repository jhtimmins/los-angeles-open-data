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

		this.handleWidth();
	}

	handleWidth()
	{
		var width = $(window).width();
		if (width < 800) {
			$("#chart-svg").attr(
				{
					"width": width * 0.75,
					"heigth": width * 0.45
				}
				);
			$("#department-text-wrapper").css({
				"margin-top": "250px",
				"float": "right",
				"width": width * 0.75
			}
			);
		} else {
			$("#department-text-wrapper").css({
				"width": width * 0.25,
				}
			);
			$("#chart-svg").attr(
				{
					"width": width * 0.48,
				}
			);
		}
	}
}