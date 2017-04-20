class Breakdown {

	constructor() {
		this.department = null;
		this.appropriations = null;
		this.department_name = null;
		this.programs = null;
	}

	init() {
		this.addSelectHandlers();
		this.getData();
	}

	addSelectHandlers()
	{	
		var that = this;
		$("#department-selector").on("change", function() {
			 that.getData($(this).val());
		});
	}

	getData(department=false)
	{
		var that = this;
		$.post('/department', {name: department}, function(json_data) {
			var data = JSON.parse(json_data)
			that.department = data.department;
			that.department_name = data.department_name;
			that.appropriations = data.appropriations;
			that.programs = data.department.programs;

			that.populateDesc(data.department, data.department_name);
			that.buildChart(data.appropriations);
			that.addHoverHandlers(data.department.programs);
		});
		
	}

	addHoverHandlers()
	{
		var that = this;
		$(".layer").mouseover(function(event) {
			var name = $(this).context.dataset.name;
			that.populateDesc(that.programs[name], name)
		});

		$("svg").mouseout(function() {
			that.populateDesc(that.department, that.department_name)
		})

		that.setTooltip();

	}

	setTooltip()
	{
		var that = this;

		$(".layer").tooltip({
			track: true,
			show: {
				boolean: false
			},
			hide: {
				boolean: false
			},
			classes: {
				"ui-tooltip": "custom-tooltip-style",
				"ui-tooltip-content": "custom-tooltip-style"
			},
			content: function() {
				var name = $(this).context.dataset.name,
				years = that.programs[name].years,
				this_year = years[2018] ? years[2018] : 0,
				last_year = years[2017] ? years[2017] : 0,
				up_arrow = '<div class="up-arrow">&#x25B2</div>',
				down_arrow = '<div class="down-arrow">&#x25BC</div>',
				change = this_year - last_year,
				icon = change >= 0 ? up_arrow : down_arrow;

				return 	'<div class="tooltip-wrapper">' +
						'<div class="tooltip-name">' + name +'</div>' +  
						'<div class="tooltip-text-big">$' + this_year.toLocaleString('en-US') + '</div>' +
						'<div class="tooltip-text-small">Fiscal Year 2017-2018</div>' +
						'<div class="tooltip-text-big">$' + change.toLocaleString('en-US') + icon + '</div>' +
						'<div class="tooltip-text-small">From Previous Year</div>' +
						'</div>';
			}
		});
	}

	populateDesc(org_data, org_name = false)
	{	
		$("#department-desc").text(org_data.description);
		if (org_name) {
			$("#department-name").text(org_name);
		} else {
			$("#department-name").empty();
		}
	}

	buildChart(appropriations_data)
	{
		var svg = d3.select("svg"),
		    margin = {top: 20, right: 20, bottom: 30, left: 70},
		    width = svg.attr("width") - margin.left - margin.right,
		    height = svg.attr("height") - margin.top - margin.bottom;

		$("svg").empty()

		var x = d3.scaleTime().range([0, width]),
		    y = d3.scaleLinear().range([height, 0]),
		    z = d3.scaleOrdinal(d3.schemeSet2);

		var stack = d3.stack().keys(appropriations_data.program_names); 

		var area = d3.area()
		    .x(function(d, i) { return x(d.data.date); })
		    .y0(function(d) { return y(d[0]); })
		    .y1(function(d) { return y(d[1]); });

		var g = svg.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  
		var data = Object.keys(appropriations_data.appropriations).map(function(key, index) {
			var row = appropriations_data.appropriations[key]
			row.date = new Date(key, 0, 1);

			return row
		});

		var years = appropriations_data.years.map(function(key, i) {
			return new Date(key, 0, 1);
		});
		x.domain([new Date(2014, 0, 1), new Date(2018, 0, 1)]);
		y.domain([0, this.getYDomain(appropriations_data.max_appropriated)]);
		z.domain(appropriations_data.program_names);

		data = data.map(function(key, index) {
		for (var i = 0; i < appropriations_data.program_names.length; i++) {
			var name = appropriations_data.program_names[i];
			if (!key[name]) {
				key[name] = 0;
			}
		}
			
			return key;
		}); 

		var layer = g.selectAll(".layer").data(stack(data))
			.enter().append("g")
		  .attr("class", "layer")
		  .attr("data-name", function(d) { return d.key })

		layer.append("path")
		  .attr("class", "area")
		  .style("fill", function(d) { return z(d.key); })
		  .attr("d", area);

		layer.attr("data-name", function(d) { return d.key; })
		  .attr("title", function(d) { return d.key; });

		g.append("g")
		  .attr("class", "axis axis--x")
		  .attr("transform", "translate(0," + height + ")")
		  .call(d3.axisBottom(x).ticks(d3.timeYear));

		g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y).tickArguments([10]).tickFormat(function(d) {
			if (d / 1000000.0) {
				return "$" + d / 1000000.0 + "M";
			}
			return "$" + d
		}));
		$(".domain").remove();
		$(".tick line").remove();
	}

	getYDomain(max_app, max_graph = 0, upper = 1000000000)
	{
		var step = upper * 0.1;
		if (max_graph > max_app) {
			return max_graph;
		} else if (max_app < step) {
			return this.getYDomain(max_app, max_graph, step)
		} else {
			return this.getYDomain(max_app, max_graph + step, upper);
		}
	}
}