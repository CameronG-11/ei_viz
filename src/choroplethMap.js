import { useEffect } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import * as d3 from "d3";


export default function ChoroplethMap({
    data,
    demographic,
    candidate,
    setPrecinct,
    margin = { top: 80, bottom: 50, right: 20, left: 100 }, // Adjust as needed
    width = 1200 - margin.left - margin.right, // Adjust as needed
    height = 800 - margin.top - margin.bottom, // Adjust as needed
}) {


    useEffect(() => {

        d3.selectAll('#ChoroplethMap svg').remove();

        let selectedGroup = demographic[0] + '_' + candidate.substring(0, 3)

        // console.log(selectedGroup)
        // Create SVG container for the map
        const svg = d3.select("#ChoroplethMap")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        const maxVal = d3.max(data.features, d => d.properties[selectedGroup])

        // Define a color scale for the choropleth
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, maxVal]); // Adjust domain based on your data

        const steps = Math.round(maxVal * 10);

        // segments the domain into steps
        const colorValues = d3.range(colorScale.domain()[0], colorScale.domain()[1], (colorScale.domain()[1] - colorScale.domain()[0]) / steps);

        // console.log(colorScale.domain())

        // Define a geographical projection
        const projection = geoMercator()
            .fitSize([width, height], data);

        // Define a path generator using the projection
        const path = d3.geoPath().projection(projection);

        // Load GeoJSON data

        // Draw each region with data-based color
        svg.selectAll("path")
            .data(data.features)
            .join("path")
            .attr("d", path)
            .attr("fill", function (d) {
                return colorScale(d.properties[selectedGroup]);
            })
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .on("click", function (event, d) {
                clickPrecinct(event, d);
            });


        // Optional: Add a legend for the color scale
        const legend = svg.append("g")
            .attr("transform", `translate(20,${height - margin.bottom})`);

        const legendScale = d3.scaleLinear()
            .domain(colorScale.domain())
            .range([0, 250]);

        const legendAxis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickSize(-10);

        // Draw the colored rectangles
        legend.append("g")
            .selectAll("rect")
            .data(colorValues)
            .join("rect")
            .attr("x", d => legendScale(d))
            .attr("y", 0)
            .attr("width", 250 / steps)
            .attr("height", 10)
            .attr("fill", d => colorScale(d));
        
        // Draw the ticks
        legend.append("g")
            .attr("transform", "translate(0,10)")
            .call(d3.axisBottom(legendScale)
                .ticks(steps)
                .tickSize(-10));


        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", 120)
            .attr("y", height - (margin.bottom + 20))
            .style("font-size", "16px")
            .text(demographic + " Support for " + candidate)
            .on("click", function (event, d) {
                resetPrecinct(event, d);
            });

        // Changes precinct
        function clickPrecinct(event, d) {
            console.log(d.properties["UNIQUE_ID"])
            console.log(d.properties[selectedGroup])
            setPrecinct(d.properties["UNIQUE_ID"])
        }

        // resets to show all precincts
        function resetPrecinct(event, d) {
            setPrecinct(null)
        }


    }, [data, demographic, candidate]);


    return (
        <div width={width} height={height} id={"ChoroplethMap"} />
    );


}



