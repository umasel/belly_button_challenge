//Belly Button Biodiversity Dashboard
document.body.style.backgroundColor = 'aliceblue';

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it - all subsequent code within this function
 
d3.json(url).then(function(data) {

  console.log(data.names[2]);

  //Create DDL from names list - working code option 1
  let myddl = d3.select('select');
  data.names.forEach(nameber => myddl.append('option').attr('value',nameber).text(nameber));
  

  //Create DDL from names list - working code option 2 - keep for future reference
  // Object.entries(data.names).forEach(([key,value])=> {
  //   currentValue = value;
  //   console.log(currentValue)
  //   let newOption = d3.select('select').append('option');
  //   newOption.attr('value',currentValue)
  //   newOption.text(currentValue)
  // });

 //interactive - user selects test subject ID from DDL. 
 //This code captures the ID and returns the associated index number (nameIndex) which is passed to the functions to update the visuals
 //This code also clears out the demographic info before repopulating it with the new data.
 //find index code from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
  let dropdown = d3.select("#selDataset");//selects by html id
  dropdown.on("change", function() {//when there is a change in the selection, do the function
    userChoice = this.value; //captures the userChoice from the ddl as the Test Sample ID (940)
    console.log(userChoice);
    const userChoiceIndex = (element) => element == userChoice;//this is the testing function (find where list element = userChoice)
    console.log(userChoiceIndex);
    nameIndex = data.names.findIndex(userChoiceIndex);//takes the userChoice and finds the associated index number (0)
    console.log(nameIndex);
    d3.select('.panel-body').html("");//clears out the demographic info 
    //run the following functions with the new nameIndex
    dInfo(nameIndex);
    barChart(nameIndex);
    bubbleChart(nameIndex);
    bbWash(nameIndex);
  });

  //set default for nameIndex to 0 NEED TO KEEP VAR - doesn't work with LET
  
  var nameIndex=(typeof nameIndex === 'undefined')? 0:nameIndex;
  console.log(nameIndex)

  //DEMOGRAPHIC INFO VISUAL
  //this displays the id, ethnicity, gender, age, location, bellybutton type and wash frequency for the default or selected Test Subject ID
  function dInfo(nameIndex) {
    let demoInfo = data.metadata[nameIndex];
    console.log(demoInfo)
    Object.entries(demoInfo).forEach(([key,value])=> {
    let addDemoData = d3.select('.panel-body').append('h5');
    addDemoData.text(`${key}:  ${value}`)
  })};
  dInfo(nameIndex);

  //BAR CHART VISUAL
  //this plots the top ten Operational Taxonomic Units (otu_id) by count (sample_values) 
  //with additional hover info giving the types of bacteria found (otu_labels) for the default or selected Test Subject ID
  function barChart(nameIndex) {
    let barx = data.samples[nameIndex].sample_values.slice(0,10).reverse();//sample_values
    let bary = data.samples[nameIndex].otu_ids.slice(0,10).reverse();//otu_ids, use this to build string for chart
    let barystr = []// use this for bar chart
    bary.forEach(pear => barystr.push(`OTU_${pear}`));
    let barz = data.samples[nameIndex].otu_labels.slice(0,10).reverse();//otu_labels
    console.log(barx)
    console.log(bary)
    console.log(barz)
    //color options
    let colorlist = [ 'red','orangered','orange', 'yellow','yellowgreen', 'green','blue','mediumblue','rebeccapurple','indigo'];//pairs with Jet and Portland
    let colorlist2 = ['#f0f921','#fdca26','#fb9f3a','#ed7953','#d8576b','#bd3786','#9c179e','#7201a8','#46039f','#0d0887']//reverse plasma

    let trace1 = {
        x: barx,
        y: barystr,
        text: barz,
        type: 'bar',
        orientation: 'h',
        marker:{color: colorlist2}
      };
      let data1 = [trace1];
      
      let layout1 = {
        title: {text: `ID_${data.names[nameIndex]} Top 10 OTUs<br><sup>(Operational Taxonomic Units)</sup>`,font: { size: 24 } },
        showlegend: false,
        height: 400,
        width: 500,
        xaxis: {title:"OTU count"},
        margin: { t: 50, r: 25, l: 75, b: 35},
        paper_bgcolor: "aliceblue",
        font: { color: "darkblue", family: "Arial" }
      };

      Plotly.newPlot("bar", data1,layout1)};
  barChart(nameIndex);

  //BUBBLEPLOT VISUAL
  //this plots all of the Operational Taxonomic Units (otu_id) on the x axis and by marker color
  //and count(sample_value) on the y axis and by marker size
  //additional hover info shows the types of bacteria found (otu_labels) for the default or selected Test Subject ID

  function bubbleChart(nameIndex) {
    let bubblex = [data.samples[nameIndex].otu_ids];
    console.log(bubblex)
    let bubbley = [data.samples[nameIndex].sample_values];
    console.log(bubbley)
    let bubblez = [data.samples[nameIndex].otu_labels];
    console.log(bubblez)
  
   let trace2 = {
      x: bubblex[0],
      y: bubbley[0],
      xlimit: 4000,
      text: bubblez[0],
      mode: 'markers',
      marker: {
        size: bubbley[0],
        color: bubblex[0],
        colorscale: 'Electric'//rainbow colorscale options Jet, Portland , other options Bluered, Electric 
      }
    };
    let data2 = [trace2];

    let layout2 = {
      title: {text: `ID_${data.names[nameIndex]} OTU Counts`,font: { size: 24 } },
      showlegend: false,
    //   height: 600,
    //   width: 600,
      margin: { t: 75, r: 25, l: 50, b: 35 },
      paper_bgcolor: "aliceblue",
      font: { color: "darkblue", family: "Arial" },
      xaxis: {title:"OTU_ID"},
      yaxis: {title: "OTU count"}
    };
 
  Plotly.newPlot('bubble', data2, layout2)};
  bubbleChart(nameIndex);


  //GAUGECHART VISUAL
  //this plots the average number of times that the default or selected Test Subject washed their belly button per week (wfreq)
  function bbWash(nameIndex) {
    let gaugechartinfo = data.metadata[nameIndex].wfreq;
    console.log(gaugechartinfo)

    let data3 = [
      {
      type: "indicator",
      mode: "gauge+number",
      value: gaugechartinfo,
      title: { text: "Belly Button Washing Frequency<br><sup>Scrubs per Week</sup>", font: { size: 24 } },
      gauge: {
        axis: { range: [null, 9], tick0: 0, dticks: 8, tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
 
          // color scheme 1:  pairs with Jet and Portland (only one color scheme should be active at a time)
          // { range: [0, 1], color: 'red'},
          // { range: [1, 2], color: 'orangered'},
          // { range: [2, 3], color: 'orange'},
          // { range: [3, 4], color: 'yellow'},
          // { range: [4, 5], color: 'yellowgreen'},
          // { range: [5, 6], color: 'green'},
          // { range: [6, 7], color: 'blue'},
          // { range: [7, 8], color: 'mediumblue'},
          // { range: [8, 9], color: 'rebeccapurple'},
          // //{ range: [9, 10], color: 'purple'} //max washing = 9, don't need this one

          // color scheme 2: pairs with Plasma (only one color scheme should be active at a time)
          { range: [0, 1], color: "#f0f921"},
          { range: [1, 2], color: "#fdca26"},
          { range: [2, 3], color: "#fb9f3a"},
          { range: [3, 4], color: "#ed7953"},
          { range: [4, 5], color: "#d8576b"},
          { range: [5, 6], color: "#bd3786"},
          { range: [6, 7], color: "#9c179e"},
          { range: [7, 8], color: "#7201a8"},
          { range: [8, 9], color: "#46039f"},
          //{ range: [9, 10], color: '#0d0887'  }//max washing = 9, don't need this one
          ],
        }
      }
    ];
  
    let layout3 = {
      width: 500,
      height: 400,
      margin: { t: 100, r: 25, l: 25, b: 25 },
      paper_bgcolor: "aliceblue",
      font: { color: "darkblue", family: "Arial" }
    };
  
  Plotly.newPlot('gauge', data3, layout3)};
  bbWash(nameIndex)

});

// helpful things I found along the way
// https://plotly.com/javascript/colorscales/

//can search bootstrap