jQuery.ajax({
	url: "/data/BDeer",
	type: "GET",

	contentType: 'application/json; charset=utf-8',
	success: function(resultData) {
		// parsing data from JSON returned by flask app
	    var parseData = JSON.parse(resultData);
	    var totalUSD = parseData['details.total_money_in_usd'];
	    var lastFundingAmount = parseData['details.last_funding_amount'];

	    // modify the Object so that "Undisclosed" data is omitted
	    for(var i in totalUSD){
	    	if(totalUSD[i] === "Undisclosed"){
	    		delete totalUSD[i];
	    	}else{
	    		totalUSD[i] = parseFloat(totalUSD[i].replace("$","").replace("M",""));
	    	}
	    }

	    for(var i in lastFundingAmount){
	    	if(lastFundingAmount[i] === "Undisclosed"){
	    		delete lastFundingAmount[i];
	    	}else{
	    		lastFundingAmount[i] = parseFloat(lastFundingAmount[i].replace("$","").replace("M",""));
	    	}
	    }

	    // use plot.ly to plot the scatter plot of last funding amount vs. total money in USD
	    // x axis is the company's last funding amount
	    // y axis is the company's total money in USD
	    var trace = {
			x: Object.keys(lastFundingAmount).map(k => lastFundingAmount[k]),
			y: Object.keys(totalUSD).map(k => totalUSD[k]),
			name: 'Name of Trace 1',
			mode: 'markers',
			type: 'scatter'
		};
		var data = [trace];
		var layout = {
			title: 'Last Funding Amount VS Total Money in USD',
			xaxis: {
				title: 'Last Funding Amount (millions)'
			},
			yaxis: {
				title: 'Total Money in USD (millions)'
			}
		};
		Plotly.newPlot('scatterPlot', data, layout);

		// use plot.ly to make the bar graph of the companies' status
		// x axis is the different status
		// y axis is the total number of companies that fall under the status
		var status = parseData['status'];
		var statusDict = {};
		for(var i in status){
			if(Object.keys(statusDict).indexOf(status[i]) > -1){
				statusDict[status[i]]++;
			}else{
				statusDict[status[i]] = 1;
			}

		}

		var data = [{
			x: Object.keys(statusDict),
			y: Object.keys(statusDict).map(k => statusDict[k]),
			type: 'bar'
		}];
		var layout2 = {
			title: 'The Number of Companies in Each Status',
			xaxix: {
				title: 'Status'
			},
			yaxis: {
				title: 'Number of Companies'
			}
		}

		Plotly.newPlot('barGraph', data, layout2);




	},
	error : function(jqXHR, textStatus, errorThrown) {
	},

	timeout: 120000,
});