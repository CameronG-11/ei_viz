import { useEffect } from 'react';
import * as d3 from "d3";


export default function DensityPlot({
  data,
  precinct,
  precincts,
  demographic,
  candidate,
  specificPrecinctData,
  margin = { top: 80, bottom: 50, right: 20, left: 100 }, // Adjust as needed
  width = 700 - margin.left - margin.right, // Adjust as needed
  height = 400 - margin.top - margin.bottom, // Adjust as needed
}) {


  useEffect(() => {

    d3.selectAll('#DensityPlot svg').remove();

    let selectedGroup = demographic + '_' + candidate;
    //console.log("data in density")
    //console.log(data)
    // console.log(selectedGroup)

    let groupData
    let calculatedBandwidth
    let title_text

    // Showing statewide data/for all precincts
    if ((precinct == null)) {
      groupData = d3.map(data, d => d[selectedGroup])
      //console.log("total group data")
      //console.log(groupData)
      calculatedBandwidth = 1.06 * d3.deviation(groupData) * Math.pow(groupData.length, -1 / 5);

      title_text = demographic + " Support for " + candidate + " Across All Precincts"
    }
    // Showing a specific precinct ()
    else {
      precinct = "021-EAST MACON 3"  // FOR TESTING, REMOVE THIS LINE AND YOU WILL BE ABLE TO ACTUALLY SELECT EACH PRECINCT!!
      let pid = precincts.indexOf(precinct)
      selectedGroup = pid + '_' + demographic[0] + '_' + candidate.substring(0, 3)
      groupData = d3.map(specificPrecinctData, d => d[selectedGroup])  //get from csv
      //console.log(groupData)
      calculatedBandwidth = 1.06 * d3.deviation(groupData) * Math.pow(groupData.length, -1 / 5);
      title_text = demographic + " Support for " + candidate + " in " + precinct
    }

    // console.log(calculatedBandwidth)

    // append the svg object to the body of the page
    const svg = d3.select("#DensityPlot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const XDomain = [0, 1];  // d3.min(prices), d3.max(prices)

    // add the x Axis
    var x = d3.scaleLinear()
      .domain(XDomain)
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


    // Compute kernel density estimation
    let xticks = 500  // adjusting changes nunber of points the line is drawn between
    var kde = kernelDensityEstimator(kernelEpanechnikov(calculatedBandwidth), x.ticks(xticks))
    const density = kde(groupData)

    const YDomain = [0, d3.max(density, d => d[1])];  // [0, d3.max(density, d => d[1])]

    // add the y Axis
    var y = d3.scaleLinear()
      .range([height, 0])
      .domain(YDomain);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Define the area path generator
    var area = d3.area()
      .curve(d3.curveBasis)
      .x(d => x(d[0]))
      .y1(d => y(d[1]))  // Top of the area, following the density line
      .y0(y(0));        // Bottom of the area, set to y = 0

    // Plot the area
    svg.append("path")
      .datum(density)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d", area);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Probability (PPM)");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .text("Density");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .style("font-size", "16px")
      .text(title_text);

    // Function to compute density
    function kernelDensityEstimator(kernel, X) {
      return function (V) {
        return X.map(function (x) {
          return [x, d3.mean(V, function (v) { return kernel(x - v); })];
        });
      };
    }
    function kernelEpanechnikov(k) {
      return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }

  }, [data, demographic, candidate, precinct]);


  return (
    <div width={width} height={height} id={"DensityPlot"} />
  );


}



