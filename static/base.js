class Base {
	init() {
		var that = this
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

		$(window).resize(function() {
			that.handleWidthDepartment();
			that.handleWidthHome();
		})

		this.handleWidthDepartment();
		this.handleWidthHome();
	}

	handleWidthDepartment()
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
				"margin-top": 0,
				"float": "left"
				}
			);
			$("#chart-svg").attr(
				{
					"width": width * 0.48,
				}
			);
		}
	}

	handleWidthHome()
	{
		var width = $(window).width();
		if (width < 1100) {
			$(".priority-image-wrapper").attr({
				"margin-top": "0"
			})
			$(".priority-image").attr(
				{
					"margin-top": 0,
					"width": (width) * 0.8,
				}
			);
		} else {
			$(".priority-image").attr(
				{
					"width": (width - 800) * 0.8,
				}
			);
		}
	}
}