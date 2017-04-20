class Breakdown {

	constructor() {
		this.department = null;
		this.appropriations = null;
		this.programs = null;
	}

	init() {
		this.addSelectHandlers();
		//var department = JSON.parse(appropriations);
		this.getData()
		//this.buildChart(appropriations);
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
			that.appropriations = data.appropriations;
			that.programs = data.department.programs;

			that.buildChart(data.appropriations);
			that.populateDesc(data.department);
			that.addHoverHandlers(data.department.programs);
		});
		
	}

	addHoverHandlers()
	{
		var that = this;
		$(".layer").mouseover(function(event) {
			that.populateDesc(that.programs[$(this).text()])
			//console.log(event.pageX);
			//console.log(event.pageY);
		});

		$("svg").mouseout(function() {
			that.populateDesc(that.department)
		})
	}

	populateDesc(org)
	{
		$("#department-desc").text(org.description);
	}

	buildChart(appropriations_data)
	{
		console.log(appropriations_data);
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
	  console.log(this.getYDomain(appropriations_data.max_appropriated));
	  x.domain(d3.extent(years));
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

	  layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.1; })
	    .append("text")
	      .attr("x", width - 6)
	      .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
	      .attr("dy", ".350em")
	      .style("font", "10px sans-serif")
	      .style("text-anchor", "end")
	      .text(function(d) { return d.key; });

	  g.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x).ticks(d3.timeYear));

	  g.append("g")
	  .attr("class", "axis axis--y")
	  .call(d3.axisLeft(y).tickFormat(function(d) {
	  	if (d / 1000000.0) {
	  		return "$" + d / 1000000.0 + "mm";
	  	}
	  	return "$" + d
	  }));
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