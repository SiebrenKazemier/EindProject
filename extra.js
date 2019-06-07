//                              BUBBLE CHART
// ############################################################################
function importData2() {
    d3.json("geslaagdenEnGezakten.json").then(function(data) {
        // add type of education to VMBO
        for (let lines of data) {
            if (lines.Onderwijstype == "VMBO") {
                lines.Onderwijstype = lines.Onderwijstype + "-" + lines.LeerwegVMBO;
            }
        }

        var groupByProvince = d3.nest()
                                .key(function(d) { return d.Provincie; })
                                .key(function(d) {return d.Onderwijstype; })
                                .rollup(function(v) { return d3.sum(v, function(d) { return d.Examenkandidaten; })})
                                .entries(data)

        for (var line of groupByProvince) {
            line["children"] = line["values"]
            line["name"] = line["key"]
            delete line.values
            for (var child1 of line.children) {
                // child1["value"] = child1["values"]
                child1["name"] = child1["key"]
                delete child1.key
                // delete child1.values
                console.log(child1)
            }

        }

        // roupByProvince = _.nest(roupByProvince, ['0', '1'] )

        circularPackingGraph(groupByProvince);

    })
}
//                          MAKE LAST CHILD
// #########################################################################

// MAKE LAST CHILD
// #############################################################################
//
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


//                              BUBBLE CHART!!
// ############################################################################
function importData3() {
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
