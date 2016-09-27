function GaugeBorder(placeholderName, configuration)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	
	this.configure = function(configuration)
	{
		this.config = configuration;
		
		this.config.size = this.config.size * 0.9;
		
		this.config.raduis = this.config.size * 0.97 / 2;
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;
		
		this.config.min = undefined != configuration.min ? configuration.min : 0; 
		this.config.max = undefined != configuration.max ? configuration.max : 100; 
		this.config.range = this.config.max - this.config.min;
		
		this.config.transitionDuration = configuration.transitionDuration || 500;
	}

	this.render = function()
	{
		var chartId = "#" + this.placeholderName;
		$(chartId).html("");
		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
							.attr("class", "gauge")
							.attr("width", this.config.size)
							.attr("height", this.config.size);
		

	  //Draw Border Semi-Circle
		this.drawBand(14.5, 85.5, "#1f1a17", 0.9, 0.95, 270, 45);
		this.drawBand(16, 84, "#aaa9a9", 0.85, 0.9, 270, 45);

		this.config.raduis = this.config.size * 0.97 / 10;
		this.drawBand(20, 80, "#1f1a17", 0.9, 1, 270, 45);
	 //Draw Bottom Center Semi-Circle
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2 + 4.47;
		this.config.raduis = this.config.size * 0.97 / 9.5;
		this.drawBand(0, 100, "#aaa9a9", 0.8, 1, 180, 90);

		this.config.raduis = this.config.size * 0.97 / 8;
		this.drawBand(5, 95, "#1f1a17", 0.83, 1, 180, 90);

		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;
	//Draw Bottom Line				
		//Draw Bottom Left Gray Line
		this.body.append("line")
                         .attr("x1", 35)
                         .attr("y1", this.config.cy+10)
                         .attr("x2", 217)
                         .attr("y2", this.config.cy+10)
					.style("stroke", "#aaa9a9")
					.style("stroke-width", "11px");

		//Draw Bottom Left Black Line
		this.body.append("line")
                         .attr("x1", 23)
                         .attr("y1", this.config.cy+20)
                         .attr("x2", 217)
                         .attr("y2", this.config.cy+20)
					.style("stroke", "#1f1a17")
					.style("stroke-width", "11px");

		//Draw Bottom Right Gray Line
		this.body.append("line")
                         .attr("x1", 322)
                         .attr("y1", this.config.cy+10)
                         .attr("x2", 505)
                         .attr("y2", this.config.cy+10)
					.style("stroke", "#aaa9a9")
					.style("stroke-width", "11px");

		//Draw Bottom Right Black Line
		this.body.append("line")
                         .attr("x1", 323)
                         .attr("y1", this.config.cy+20)
                         .attr("x2", 517)
                         .attr("y2", this.config.cy+20)
					.style("stroke", "#1f1a17")
					.style("stroke-width", "11px");

		this.config.raduis = this.config.size * 0.97 / 2;
		var greenZones = [{ from: this.config.min, to: this.config.max}];
		for (var index in greenZones)
		{
			this.drawBand1(greenZones[index].from, greenZones[index].to, 0.65, 0.75, 170, 255);
		}


		var minorDelta = 100 / (this.config.minorTicks-1);
		this.config.raduis = this.config.size * 0.97 / 5;

		var val1 = 190, val2 = -10;

		if(this.config.minorTicks == 5){
			val1=159;
		}else if(this.config.minorTicks == 6){
			val1=159;
		}else if(this.config.minorTicks == 8){
			val1=185;
		}else if(this.config.minorTicks == 9){
			val1=158;
		}else if(this.config.minorTicks == 10){
			val1=177;
		}
		for (var minor = 0; minor <= 100; minor += minorDelta)
		{

			var point1 = this.valueToPoint(minor, 0.5, val1, val2);
			var point2 = this.valueToPoint(minor, 0.7, val1, val2);
			
			this.body.append("svg:line")
						.attr("x1", point1.x)
						.attr("y1", point1.y)
						.attr("x2", point2.x)
						.attr("y2", point2.y)
						.style("stroke", "#c2c1c1")
						.style("stroke-width", "3px");
		}

	}
	
	this.drawBand = function(start, end, color, inner_radius, outer_radius, value1, value2)
	{
		if (0 >= end - start) return;
		
		this.body.append("svg:path")
					.style("fill", color)
					.attr("d", d3.svg.arc()
						.startAngle(this.valueToRadians(start, value1, value2))
						.endAngle(this.valueToRadians(end, value1, value2))
						.innerRadius(inner_radius * this.config.raduis)
						.outerRadius(outer_radius * this.config.raduis))
					.attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate("+value1+")" });
	}
	
	this.drawBand1 = function(start, end, inner_radius, outer_radius, value1, value2)
	{
		if (0 >= end - start) return;
		
		// Define the gradient
		var gradient = this.body.append("svg:defs")
		    .append("svg:linearGradient")
		    .attr("id", "gradient")
		    .attr("x1", "0%")
		    .attr("y1", "0%")
		    .attr("x2", "100%")
		    .attr("y2", "100%")
		    .attr("spreadMethod", "pad");

		// Define the gradient colors
		gradient.append("svg:stop")
		    .attr("offset", "15%")
		    .attr("stop-color", "#239f38")
		    .attr("stop-opacity", 1);

 		gradient.append("svg:stop")
		    .attr("offset", "42%")
		    .attr("stop-color", "#fef000")
		    .attr("stop-opacity", 1);

 		gradient.append("svg:stop")
		    .attr("offset", "55%")
		    .attr("stop-color", "#f4b609")
		    .attr("stop-opacity", 1);

 		gradient.append("svg:stop")
		    .attr("offset", "60%")
		    .attr("stop-color", "#e98514")
		    .attr("stop-opacity", 1);


		gradient.append("svg:stop")
		    .attr("offset", "80%")
		    .attr("stop-color", "#da251d")
		    .attr("stop-opacity", 1);

		this.body.append("svg:path")
					.style("fill", "url(#gradient)")
					.attr("d", d3.svg.arc()
						.startAngle(this.valueToRadians(start, value1, value2))
						.endAngle(this.valueToRadians(end, value1, value2))
						.innerRadius(inner_radius * this.config.raduis)
						.outerRadius(outer_radius * this.config.raduis))
					.attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate("+value1+")" });
	}
	
	this.valueToDegrees = function(value, value1, value2)
	{
		// thanks @closealert
		//return value / this.config.range * 270 - 45;
		return value / this.config.range * value1 - (this.config.min / this.config.range * value1 + value2);
	}
	
	this.valueToRadians = function(value, value1, value2)
	{
		return this.valueToDegrees(value, value1, value2) * Math.PI / 180;
	}
	
	this.valueToPoint = function(value, factor, value1, value2)
	{
		return { 	x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value, value1, value2)),
					y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value, value1, value2)) 		};
	}
	// initialization
	this.configure(configuration);	
}