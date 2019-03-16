var genres = ["Action","Animation=","Comedy","Drama","Documentary","Romance","Horror"];
var svg = d3.select("#chartContainer")
            .insert("svg",":first-child")
            .attr("width", "100%")
            .attr("height", "100%");

d3.idmb(, function (data) {
  //Create year-aggregated data
  var year_data= d3.nest()
    .key(function(d) { return parseInt(d.year);}).sortKeys(d3.ascending)//group by year
    .rollup(function(d) { return genres.reduce(//rollup sums of genre per year
      function(store,genre){//create dictionary with count and each genre for each year
        store[genre] = d3.sum(d, function(line) {
          return line[genre];
        });
        return store;
      },{'count':d.length});
    })
    .entries(data)//compute from .idmb data
    .filter(function(entry){return entry['key']>=1915 && entry['key']<2017;});//filter out certain year ranges

  //Compute number of movies per year
  var count_data = year_data.map(function(entry){
    return {'Year':entry.key,
            'Count':entry.values['count']};
  });

  //Compute flattened genre representations per year
  var genre_data = year_data.map(function(entry){//Trasform into flattened representation for dimple.js
    return genres.map(function(genre){
      return {'Year':entry.key,
              'Genre':genre,
              'Count':entry.values[genre]};
      });
    })
  .reduce(function(all_data,year_data){//Concat seperate list into a single list
    return all_data.concat(year_data);
   },[]);
   //Debugging log
console.log(genre_data);
console.log(count_data);

//Create dimple chart
var chart = new dimple.chart(svg);
chart.setMargins("8%", "10%", "12%", "10%");

//Make x axis
var x_axis = chart.addTimeAxis("x", "Year");
x_axis.timePeriod = d3.time.years;
x_axis.timeInterval = 5;
x_axis.tickFormat = "%Y";

//Make y axis
var y_axis = chart.addMeasureAxis("y", "Count");
y_axis.oldFormat = y_axis.tickFormat;
y_axis.tickFormat = 'd';
