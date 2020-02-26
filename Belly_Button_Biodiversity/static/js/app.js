function buildMetadata(sample) {

  // Get URL of metadata
  var url = `/metadata/${sample}`;

  // Select area to place metadata
  var panel = d3.select("#sample-metadata");

  // Clear previous html
  panel.html("");

  // Get metadata in json from url
  d3.json(url).then(data => {

    // Get keys and values of data
    Object.entries(data).forEach(([key,value]) => {

      // Create new line
      var line = panel.append("p")

      // Write key and value to line
      line.text(`${key}: ${value}`)
    });
  });
}

function buildCharts(sample) {

  // Get url of sample data
  var url =`/samples/${sample}`;

  // Get sample data in json from url
  d3.json(url).then(data =>  {

    // Create variables of the top 10 species
    var pieLabels = data['otu_ids'].slice(0,10);
    var pieValues = data['sample_values'].slice(0,10);
    var pieHover = data['otu_labels'].slice(0,10);

    // Create variables of all species
    var bubbleX = data['otu_ids'];
    var bubbleY = data['sample_values'];
    var bubbleText = data['otu_labels'];

    // Format pie chart data for plotly
    var pieData = [{
      values: pieValues,
      labels: pieLabels,
      hovertext: pieHover,
      hovertemplate: '<b>%{text}</b><br>' +
        'UTO ID: %{label}<br>' +
        'Value: %{value}<br>' +
        '%{percent}' +
        '<extra></extra>',
      type: "pie"
    }];

    // Format pie chart layout
    var pieLayout = {
      height: 500,
      width: 700,
      title: 'Distribution of Top Ten Species in Belly Button'
    };

    //Format bubble chart data for plotly
    var bubbleData = [{
      x: bubbleX,
      y: bubbleY,
      text: bubbleText,
      hovertemplate: '<b>%{text}</b><br>' +
        'UTO ID: %{x}<br>' + 
        'Value: %{y}' + 
        '<extra></extra>',
      mode: 'markers',
      marker: {
        color: bubbleX,
        colorscale: 'Portland',
        size: bubbleY
      }
    }];

    // Format bubble chart layout
    var bubbleLayout = {
      height: 750,
      width: 1200,
      hovermode: 'closest',
      title: 'Belly Button Biodiversity of Sample',
      xaxis: {
        title: 'UTO ID',
        zeroline: false
      }
    };

    //Create plotly plots
    Plotly.newPlot("pie", pieData, pieLayout);
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });

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
