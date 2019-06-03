/******************************************************************************
Name: Siebren Kazemier
School: Uva
Student number: 12516597
Project: Assignment week 4, Creating a bar graph
******************************************************************************/
var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
	,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
	,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
	,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

window.onload = function() {
    importData();
};

function importData(dataLink) {
    d3.json("LaborForceParticipationRateFemale.json").then(function(data) {
        // creates a list with years
        console.log(data)
        var yearList = [];
        for (let year of data.columns) {
            if (year != "Country" & year != "Code") {
                yearList.push(year)
            }
        }
        // adds data to the years
        var yearDict = {}
        var count = 1
        for (let year of yearList) {
            count++;
            var list = []
            for (let row of data.data) {
                var countryDict = {};
                countryDict["country"] = row[0];
                countryDict["value"] = row[count];
                list.push(countryDict);

            }
            yearDict[year] = list;
        }
        sunBurst(yearDict[2012]);

    })
}

function sunBurst(yearDict) {
    // dimentions of subBurst
    const width = 500;
    const height = 500;

    var dataList = [];

    // scale data for regions
    // var average = 0;
    // for (let rows of yearDict) {
    //     if (rows.country == "Australia" || rows.country == "European Union" ||
    //     rows.country == "United States" || rows.country == "Sub-Saharan Africa" ||
    //     rows.country == "South Asia" || rows.country == "Middle East & North Africa" ||
    //     rows.country == "Latin America & Caribbean") {
    //         dataList.push(rows.value);
    //     }
    // }

    for (let rows of yearDict) {
        if (country_list.indexOf(rows.country) > 0) {
            console.log(rows.country)
            dataList.push(rows.value);
        }
    }

    // make canvas
    var canvas = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

    // make group element g
    var group = canvas.append("g")
                        .attr('transform', 'translate(200 ,200)');

    // rescale data to pie data
    var pie = d3.pie()
    	.value(function(d) { return d; });

    console.log(pie(dataList))
    // makes color list
    var myColor = d3.scaleOrdinal().domain(dataList)
                    .range(d3.schemeSet3);

    // create arc
    var arc = d3.arc()
                .innerRadius(200)
                .outerRadius(250)

    var path = group.selectAll("path")
                    .data(pie(dataList))
                    .enter()
                    .append("path")

    // draw circle path
    path.attr("d", arc)
        .style("fill", function(d) { return myColor(d.data)})
}











function test() {
    // dimentions of subBurst
    const width = 500;
    const height = 500;

    var canvas = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

    var group = canvas.append("g")
                        .attr('transform', 'translate(200 ,200)');

    // var r = 100;
    // var p = Math.PI * 1;

    var arc = d3.arc()
                .innerRadius(function(d) { return d.x0; })
                .outerRadius(function(d) { return d.x1; })
                .startAngle(function(d) { return Math.sqrt(d.y0); })
                .endAngle(function(d) { return Math.sqrt(d.y1); })


        var path = vis.data([json]).selectAll("path")
    .data(nodes)
    .enter()

    .append("svg:path")
    .attr("display", function(d) { return d.depth ? null : "none"; })
    .attr("d", arc)
    .attr("fill-rule", "evenodd")
    .style("fill", function(d) { return colors[d.data.name]; })
    .style("opacity", 1)
    .on("mouseover", mouseover);
}
