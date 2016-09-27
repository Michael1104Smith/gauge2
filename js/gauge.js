function Gauge(placeholderName, configuration)
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
		
		this.config.majorTicks = configuration.majorTicks || 5;
		this.config.minorTicks = configuration.minorTicks || 2;
		
		this.config.greenColor 	= configuration.greenColor || "#84c225";
		
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
		
		var fontSize = Math.round(this.config.size / 16);
		var minorDelta = this.config.range / (this.config.majorTicks - 1);
		var first_flag = 0;
		var top_value;
		for (top_value = this.config.min; top_value <= this.config.max; top_value += minorDelta)
		{
		}
		top_value -= minorDelta;
		console.log(top_value);
		for (var minor = this.config.min; minor <= this.config.max; minor += minorDelta)
		{
			var point1 = this.valueToPoint(minor, 0.51, 156, -12);
			var point2 = this.valueToPoint(minor, 0.71, 156, -12);
			
			var delta_y = point1.y - point2.y;
			var delta_x = point1.x - point2.x;
			var rotate_value = Math.atan(delta_y/delta_x)/Math.PI*180 - 90;
			if(minor > (this.config.min + top_value)/2 + minorDelta - 1){
				rotate_value = Math.atan(delta_y/delta_x)/Math.PI*180 + 90;
			}else{
				if(Math.abs(rotate_value) > 150){
					rotate_value = Math.atan(delta_y/delta_x)/Math.PI*180 + 90;
				}
			}
			var pos_x = (point1.x + point2.x) /2;
			var pos_y = (point1.y + point2.y) /2;

			var value_fontsize = fontSize/5*2;

			if(first_flag == 0){
				pos_x -= 2;
				pos_y += 2;
				if(minor>9){
					pos_x -= 1;
					pos_y += 8;
				}else if(minor>4){
					pos_x -= 1;
					pos_y += 4;
				}
				first_flag = 1;
			}

			if(minor > this.config.max - minorDelta){
				if(this.config.max == 100){
					pos_x += 2;
					pos_y += 5;
				}
			}

			var cur_text = Math.round(minor);
			this.body.append("text")
			 			.attr("dy", value_fontsize / 3)
			 			.attr("text-anchor", minor == this.config.min ? "start" : "end")
			 			.text(cur_text)
			 			.attr("transform","translate("+pos_x+","+pos_y+") rotate("+rotate_value+")")
			 			.style("font-size", value_fontsize + "px")
						.style("fill", "#333")
						.style("stroke-width", "0px");
		}
		
		this.config.raduis = this.config.size * 0.97 / 2;
		
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