/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Final project
******************************************************************************/
window.onload = function() {
    importData();
}

function importData() {
    d3.json("bubbleData.json").then(function(data) {
        wordCloud(data);
    })
}

function wordCloud(data) {
    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(function(d) { return d.province})
                  .range(["#E27D60", "#37B5FF", "#E8A87C", "#C38D9E", "#FAC2C1", "#85DCB2", "#41B3A3", "F9FF49", "B5F569" ,"FFAD5F", "white", "63FF53"])

    // create list of words
    var wordList = [];
    for (var line of data) {
        var dict = {}
        dict["word"] = line.name
        if ((line.value/20) < 12) {
            dict["size"] = 12;
        }
        else {
            dict["size"] = line.value/20
        }
        dict["province"] = line.province
        wordList.push(dict)
        // console.log(dict)
    }

    // get margins from container
    var selection = d3.select("#graph4")
                    .node().getBoundingClientRect()

    var height = selection["height"]
    var width = selection["width"]

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10}

    width = width - margin.left - margin.right;
    height = width - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#graph4").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create word layout
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(wordList.map(function(d) { return {text: d.word, size:d.size, province:d.province}; }))
        .padding(5)        //space between words
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })      // font size of words
        .on("end", draw);
    layout.start();

    // draw words
    function draw(words) {
    svg.append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", function(d) { return color(d.province) })
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
            .text(function(d) { return d.text; });
    }
}
