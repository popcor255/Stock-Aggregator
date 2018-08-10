var connection = true;
var charts = [];
var chart_index = 0;
var number = -1;
var container;
var ele;
var wrapper;
var api;
var stocks;
var data;
var results = null;
var intervals = 'daily';
var amount = 35;
var current_price = 0;
var current_stock = null;
var options = null;
var stock_list = ['GOOGL', 'TSLA', 'FB', 'JNJ', 'SPY', 'AMZN', 'AAPL','GPS'];
var stock_index = 0;

function loadScript(){
  //api token 
    stocks = new Stocks("XNVNORVDGFRLHC00");
    container = document.getElementById("container");
    getResults();
};

function loadCharts(){
  setTimeout(check, 1000)
}

async function Results(type, label){

  var ReturnObjs;

  stocks.timeSeries(options).then(
  function(result) {

        if(result.length == 0){
          connection = false;
        }
        else{
          connection = true;
        }
      
        console.log(result);
        var v_array = [];
        var c_array = [];

        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];


        var dateFormat = 'MMMM DD YYYY';
        var dateOffset = (24*60*60*1000) * 2;
        var d = new Date(result[result.length - 1].date.getTime());

        var date = monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear(); 
      
        var data = getRandomData(date, amount);

        var volume = {  
          v: number,
          t: number
        };

        current_price = result[result.length - 1].close;

        for(var x = 0; x < result.length; x++){
          data[x].o = result[x].open;
          data[x].c = result[x].close;
          data[x].h = result[x].high;
          data[x].l = result[x].low;
          volume.v  = result[x].volume;
          volume.t  = data[x].t;
          v_array.push(volume);
        }

        c_array = data;

        if(type == "candlestick"){
          setResults(c_array);
        }
        else if(type == "volume"){
          setResults(v_array);
        }
        
        createChart(type, label);
      
  }).catch(function(e){

    //error handling logic
  });
}

function getResults(){
  if(stock_list.length > stock_index){
    addChart('candlestick', stock_list[stock_index]);
    if(connection == true){
      stock_index += 1;
    }
    window.setTimeout(function(){
      getResults();
    },3400);
  }
  else{
    stock_index = 0;
  }
  return results;
}

function setResults(r){
  results = r;
}

function addChart(type, label){
    current_stock = label;
    setOptions();
    Results(type, label);
}

function createChart(type, label){
    
    var obj = null;  

    wrapper = document.createElement("div");
    wrapper.style.opacity = 0;
    ele = document.createElement("canvas");
    wrapper.setAttribute("class", "chart_wrapper");
    ele.setAttribute("class", "charts");
    ele.setAttribute("id", "chart_" + chart_index);
    container.appendChild(wrapper);
    wrapper.appendChild(ele);

    if(type == "candlestick"){
      obj = candlestick();  
    }

    charts[chart_index] = new Chart(document.getElementById("chart_" + chart_index), obj);      


    window.setTimeout(function(){
      wrapper.style.opacity = 1;
    },200);

    chart_index++;

    return ele;   
}

function candlestick(){
    var obj = {
      type: 'candlestick',
      data: {
        datasets: [{ 
          color: {
            down: '#80ff80',
            up: '#ff6666',
            unchanged: '#999',
          },
          borderColor: '#000',
          borderWidth: 2,
            label: "(" + current_stock + ") " + current_price,
            data: results
          }]
      },
      options: {
				tooltips: {
					position: 'nearest',
					mode: 'index',
				},
			},
    };
    return obj;
}

function setOptions(){
  options = {
    symbol: current_stock,
    interval: intervals,
    amount: amount
  }
}

function setWholeSet(values){
  set = values;
}

function getWholeSet(values){
 return set;
}

function setSet(index, value){
  set[index] = value;
}

function getSet(){
 return sets[0];
}

function scrollTo(e){
  var ele = document.getElementById(e);
  if(ele != null){
    ele.scrollIntoView({ behavior: 'smooth', block: 'center'});
  }
}

function getRandomData(date, count) {
	var dateFormat = 'MMMM DD YYYY';
	var date = moment(date, dateFormat);
	var data = [randomBar(date, 30)];
	while (data.length < count) {
		date = date.clone().add(1, 'd');
		if (date.isoWeekday() <= 5) {
			data.push(randomBar(date, data[data.length - 1].c));
		}
	}
	return data;
}


loadScript();

