import { Component, ElementRef,Input, OnInit, OnChanges,ViewChild, ViewEncapsulation, SimpleChanges  } from '@angular/core';
import * as d3 from 'd3';
import { MatInkBar } from '@angular/material';
import * as topojson from 'topojson';


@Component({
	encapsulation: ViewEncapsulation.None,
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})
export class GlobeComponent implements OnInit {
// width and height
  @Input()longitude=0;
  @Input()latitude=0;
  width = 960;
  height = 500;
  radius = this.height / 2 -5;
  scale = this.radius;
  velocity = 0.02
  projection = null;
  svg = null;
  land=null;

  path = null;
  elapsed = 0

  constructor() {
	
  }
  ngOnChanges(changes:SimpleChanges) {
	  //this.loop();
	  if ('longitude' in changes && 'latitude' in changes && changes['longitude']['firstChange'] == false) {
		this.relocate(changes['latitude']['previousValue'],  changes['longitude']['previousValue'] ,changes['latitude']['currentValue'],changes['longitude']['currentValue'])
	  }

  }
  ngOnInit() {
	let jsondata = d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json");
	jsondata.then((data) => {
		this.land = topojson.feature(data, data.objects.countries).features

		this.draw()
		
		//this.loop();
	})
  }

  draw() {
	if (this.land == null) return
	console.log(this.longitude)
	
	this.projection = d3.geoOrthographic().translate([this.width/2, this.height/2]).scale(this.scale).clipAngle(90).rotate([-1 * this.longitude,-1 * this.latitude]);
	//SVG container
	this.path = d3.geoPath()
	.projection(this.projection);
	this.svg = d3.select("svg#globe")
		  .attr("width", this.width)
		  .attr("height", this.height);
	this.svg.append("path").datum({type:"Sphere"}).attr("class","water").attr("d", this.path)
	//debugger;
	var world = this.svg.selectAll("path.land")
		.data(this.land)
		.enter().append("path")
		.attr("class", "land")
		.attr("d", this.path)
	  //90,0
  //this.context = this.canvas.node().getContext("2d");
  //this.path=d3.geoPath().projection(this.projection).context(this.context);
  }

  relocate(latitude_old, longitude_old, latitude_new,longitude_new) {
	var self = this;
	var i=0;
	var scaleMiddle = this.width/2;
    var scaleStartEnd = this.width * 2;
	d3.transition()
	  .tween("rotate",function () {
		  console.log("Rotating")

 
		// next point:
		var p = [latitude_old, longitude_old]
		// current rotation:
		var currentRotation = self.projection.rotate();  
		// next rotation:
		var nextRotation = self.projection.rotate([-p[0],-p[1]]).rotate();
		
		// Interpolaters:
		var r = d3.geoInterpolate(currentRotation,nextRotation);
		var s = d3.interpolate(0.0000001,Math.PI);
		
		return function(t) {
			console.log("tweening " + t)
		  // apply interpolated values
		  let diff_lng=longitude_new - longitude_old
		  let diff_latt=latitude_new - latitude_old
		  self.projection.rotate([-t*diff_lng + -1 * longitude_old,-t * diff_latt + -1 * latitude_old])//.center([0 - (t * 30),35]) 
			//.scale(  (1-Math.abs(Math.sin(s(t))))*scaleStartEnd + Math.abs(Math.sin(s(t)))*scaleMiddle  ) ;          
			self.svg.selectAll("path").attr("d", self.path);
		
		}
	  })
	  .duration(3000)
	  //.on("end", function() {  loop();  })
	
	
  }
}


// map projection

            




