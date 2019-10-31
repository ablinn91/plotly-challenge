

function buildMetadata(sample) {
  var url1 = "/metadata/"+sample;
  d3.json(url1).then(function(sample) {
    //console.log(sample);
    var metadata = d3.select("#sample-metadata");
// Use `.html("") to clear any existing metadata
    metadata.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  Object.entries(sample).forEach(function([input,output]){
    var row = metadata.append("panel-body");
    row.text(input+":"+output+"\n");
  });


  });

}
    

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {
  var url2 = "/samples/"+sample;
  // @TODO: Build a pie Chart using the sample data
  d3.json(url2).then(function(sample){
    // @TODO: Build a Bubble Chart using the sample data
    var trace = {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        color: sample.otu_ids,
        size: sample.sample_values
      }
    };
    var data = [trace];
    var layout = {
      xaxis: {title:"ID"},
  };
    Plotly.newPlot('bubble',data,layout);


  d3.json(url2).then(function(sample){
    // var pieSliceSize = sample.sample_values.slice(0,10);
    // var pieLabels = sample.otu_ids.slice(0,10);
    // var pieHoverText = sample.otu_labels.slice(0,10);

    var pieInfo = [{
      values: sample.sample_values.slice(0,10),
      labels: sample.otu_ids.slice(0,10),
      hovertext: sample.otu_labels.slice(0,10),
      type: "pie"
    }];
    Plotly.newPlot("pie",pieInfo);

  });
});
// @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init(); 