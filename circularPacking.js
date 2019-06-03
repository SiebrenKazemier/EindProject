/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Assignment week 4, Creating a bar graph
******************************************************************************/
window.onload = function() {
    importData();
    // importData2();
};


function importData() {
    d3.json("geslaagdenEnGezakten.json").then(function(data) {
        console.log(data)
        // calculate total amount of candidates
        let candidates = 0;
        for (let lines of data) {
            candidates += lines.Examenkandidaten;
        }
        var rootNode = {"name": "Nederland", "value" : candidates}

        // add type of education to VMBO
        for (let lines of data) {
            if (lines.Onderwijstype == "VMBO") {
                lines.Onderwijstype = lines.Onderwijstype + "-" + lines.LeerwegVMBO;
            }
        }

        // makes list of all the different items of a column
        function makeList(column) {
            var nameList = []
            for (let lines of data) {
                if (nameList.indexOf(lines[column]) < 0) {
                    nameList.push(lines[column]);
                }
            }
            return nameList;
        }

        // make first child (province)
        function addChildren(province) {
            var counter = 0;
            for (let lines of data) {
                if (lines["Provincie"] == province) {
                    counter += lines.Examenkandidaten
                }
            }
            return {"name": province, "value": counter};
        }

        // make second child (education type)
        function addChildren2(schooltype, province) {
            var counter = 0;
            for (let lines of data) {
                if (lines["Onderwijstype"] == schooltype & lines["Provincie"] == province) {
                    counter += lines.Examenkandidaten
                }
            }
            return {"name": schooltype, "value": counter, "children": []}; // <-------------------- , "children": [] for empty list
        }

        // make name lists
        var provinceList = makeList("Provincie")
        var schooltypeList = makeList("Onderwijstype")
        var schoolList = makeList("Instellingsnaam")


        // append all childs
        var childList = [];
        for (let province of provinceList) {
            var child = addChildren(province)
            var SecondChildList = [];
            for (let schooltype of schooltypeList) {
                SecondChildList.push(addChildren2(schooltype, province))
            }
            child["children"] = SecondChildList;
            childList.push(child);
        }
        rootNode["children"] = childList;

                                // MAKE LAST CHILD
// #############################################################################

        // // third level childs
        // let list = [];
        // for (let name of schoolList) {
        //     for (let levels of schooltypeList) {
        //         var thirdCounter = 0;
        //         for (let line of data) {
        //             if (line["Instellingsnaam"] == name & line["Onderwijstype"] == levels) {
        //                 thirdCounter += line.Examenkandidaten;
        //                 var provinces = line.Provincie;
        //             }
        //         }
        //         if (thirdCounter > 0) {
        //             list.push({"name": name, "value": thirdCounter, "provinces": provinces, "level": levels});
        //         }
        //     }
        // }
        //
        // // add third level childs
        // for (let item of rootNode["children"]) {
        //     for (let line of list) {
        //         if (item.name == line.provinces) {
        //             for (var levels of item.children) {
        //                 if (levels.name == line.level) {
        //                     delete line["provinces"]
        //                     delete line["level"]
        //                     levels.children.push(line)
        //                 }
        //             }
        //         }
        //     }
        // }

        circularPackingGraph(rootNode);
    })
}

function circularPackingGraph(rootNode) {
    var width = 1500;
    var height = 1200;

    var canvas = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(50,50)");

    // create layout
    var layout = d3.pack()
                .size([width, height - 50])
                .padding(0);


     // assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(rootNode, function(d) {
        return d.children;
    });

    // maps the node data to the pack layout
    nodes = layout(nodes);


    var node = canvas.selectAll(".node")
                    .data(nodes.descendants()) // <------------------------------- nodes.descendants().slice(1) removes rootnode
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"; });

    // append circle to nodes
    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .attr("fill", "steelblue")
        .attr("opacity", 0.25)
        .attr("stroke", "#ADADAD")
        .attr("stroke-width", "s2")

    // select circles
    var circle = canvas.selectAll("circle")

    circle.on("mouseenter", handleMouseEnter)
            .on("mouseout", handleMouseOut)

    // select root node
    var root = canvas.select(".node")


    console.log(nodes)



                            // APPLY TEXT!!!
// ###########################################################################


    // node.append("text")
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return d.children ? "" : d.data.name })


                            // APPLY MOVEMENT
// ###########################################################################

    // function simulation() {
    //     // Features of the forces applied to the nodes:
    //     var simulation = d3.forceSimulation()
    //         .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    //         .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    //         .force("collide", d3.forceCollide().strength(0.1).radius(function (d) {return d.r} ).iterations(1)) // Force that avoids circle overlapping
    //
    //     // Apply these forces to the nodes and update their positions.
    //     // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    //     simulation.nodes(nodes.descendants())
    //             .on("tick", function(d){ node.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")"; });
    //         });
    // }
    //
    // root.on("mouseout", function(d) { return simulation() });
    //
}

// Create event for mouse over
function handleMouseEnter(d, i) {
    // change dot size
    d3.select(this)
        .attr("opacity", 0.4)
        .attr("stroke", "#000")
        .attr("stroke-width", "3")
        // .style("stroke", "black");
};

// handles mouse out
function handleMouseOut(d, i) {
    // change size dots back to normal
    d3.select(this)
        .attr("opacity", 0.25)
        .attr("stroke", "#ADADAD")
        .attr("stroke-width", "s2")
};








function importData2() {
    d3.json("geslaagdenEnGezakten.json").then(function(data) {
        var nameList = []
        for (let lines of data) {
            if (nameList.indexOf(lines["Instellingsnaam"]) < 0) {
                nameList.push(lines["Instellingsnaam"]);
            }
        }
        let list = [];
        for (let name of nameList) {
            var counter = 0;
            for (let line of data) {
                if (line["Instellingsnaam"] == name) {
                    counter += line.Examenkandidaten;
                }
            }
            list.push({"name": name, "value": counter});
        }
        bubblechart(list);

    })
}

function bubblechart(data) {
    // set the dimensions and margins of the graph
var width = 800;
var height = 600;

// append the svg object to the body of the page
var svg = d3.select("body")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Initialize the circle: all located at the center of the svg area
var node = svg.append("g")
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("r", function(d) { return d.value / 100})
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", "#69b3a2")
    .style("fill-opacity", 0.3)
    .attr("stroke", "#69a2b2")
    .style("stroke-width", 4)

// Features of the forces applied to the nodes:
var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(0.7)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(1)) // Force that avoids circle overlapping

// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(data)
    .on("tick", function(d){
      node
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
    });
}


// #############################################################################
//                              VRAGEN!!!!
// #############################################################################

// 1. Hoe meer children toevoegen zonder dat hij te langzaam word?
// 2. d.Name werkt niet maar d.value wel?
