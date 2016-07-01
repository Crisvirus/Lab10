/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var iter=9;
var imageSearch;
var flightPlanCoordinates=[];
var onoff=0;
var tmp;
var lum;
google.load('search', '1');
var test_news=[
	{
		pk:"1",
		title:"Masina",
		content:"Description 1",
		image:"https://i.imgur.com/z671OfK.jpg"
	},
	{
		pk:"2",
		title:"Title 2",
		content:"Description 2",
		image:"http://ocw.cs.pub.ro/courses/res/sigla_iot.png"
	},
	{
		pk:"3",
		title:"Title 3",
		content:"Description 3",
		image:"http://ocw.cs.pub.ro/courses/res/sigla_iot.png"
	},
	{
		pk:"4",
		title:"Title 4",
		content:"Description 4",
		image:"http://ocw.cs.pub.ro/courses/res/sigla_iot.png"
	},
	{
		pk:"5",
		title:"Title 5",
		content:"Description 5",
		image:"http://ocw.cs.pub.ro/courses/res/sigla_iot.png"
	}
];
var date=[0];
var app = {
    // Application Constructor
    initialize: function() {
    	//this.makeChart();
    	
        this.bindEvents();
        this.startDash();
		$("*[data-action=close-menu]").click(app.hideMenu);
		$("*[data-action=show-menu]").click(app.showMenu);
		$("*[data-action=toggle-menu]").click(app.toggleMenu);
		$("#content").width( $( window ).width() );
		$("#header").width( $( window ).width() );
		$("*[data-role=page]").first().show();
		hash = location.hash.substr(1).split('&');
		if(document.getElementById(hash[0])){
			app.showPage(hash[0]);
		}	
		this.updateNews();
		//this.makeChart();
		this.getSettings();
		this.getACC();
		//this.getWeather();

		//this.setStatusbar();
		this.updateMap();
		
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
    	//setInterval(app.updateMap, 5000);
    	//setInterval(app.chatGet, 1000);
    	// setInterval(function(){
    	// 	navigator.vibrate(1000);
    	// },5000);
		$("#butttemp").click(app.ShowTemp);
		$("#clearall").click(function()
			{
				console.log("aici")
				$("#wea>#weacards").html("");
			});
		$("#buttlum").click(app.ShowLum);
		$("#buttled").click(app.Led);
    	$("#chat_controls>#butt1").click(app.chatSend);
    	$("#colorsett>#butt2").click(app.colorSet);
    	$("#images>#butt3").click(app.Photo);
    	$("#wea>#buttcity").click(app.getWeather);
    	$("#trip_input>#butt5").click(app.getTrip);
        document.addEventListener('deviceready', this.onDeviceReady, false);
		window.addEventListener('hashchange', this.hashChange, false);
		//window.addEventListener("batterystatus", onBatteryStatus, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
	//events on hash/location change
	hashChange: function(){
		var hash = location.hash.substr(1);
		var values = {};
		hash = hash.split('&');
		hash.forEach(function(el,index){
			if(el.indexOf("=")>=0){
				el = {name:el.split("=")[0] , value:el.split("=")[1]};
				values[el.name] = el.value;
				hash[index]=el;
			}
		});
		if(document.getElementById(hash[0])){
			app.showPage(hash[0]);
		}
	},
    // Update DOM on a Received Event
    // receivedEvent: function(id) {
    //     var parentElement = document.getElementById(id);
    //     var listeningElement = parentElement.querySelector('.listening');
    //     var receivedElement = parentElement.querySelector('.received');

    //     listeningElement.setAttribute('style', 'display:none;');
    //     receivedElement.setAttribute('style', 'display:block;');

    //     console.log('Received Event: ' + id);
    // },
	showPage: function(id){
		if( document.getElementById(id).getAttribute("data-role") == "page"){
			$("*[data-role=page]").hide();
			$("#"+id).show();
			app.hideMenu();
		}
	},
	showMenu: function(){
		document.getElementById("app").classList.add("show");
	},
	
	hideMenu: function(){
		document.getElementById("app").classList.remove("show");
	},
	
	toggleMenu: function(){
		if(document.getElementById("app").classList.contains("show")){
			app.hideMenu();
		}else{
			app.showMenu();
		}
	},
	chatSend:function(){
	var user = $("#username").val(); //get username
	var msg = $("#msg").val(); // get msg
	// var new_div = $("<div>"+user+":"+msg+"</div>"); // create a new div
	// $("#chat_box").append(new_div);
	$.post('http://192.168.1.213/light', JSON.stringify(
         {username:$("#username").val(), msg:$("#msg").val()})
    );
    app.chatGet();
  	},
  	chatGet: function(){
  		$("#chat_box").html("");
  		$.get('http://192.168.1.213:8000/api', function(msgs){
  			//display msgs in some container
  			console.log(msgs);
  			var mesaj = $("#templates>.mesaj").clone();
			mesaj.find(".title").html(msgs.temp); //set .title element of the card
  			$("#chat_box").append(mesaj);
  		// 	for(i=4; i>=0; i--)
  		// 	{
  		// 		//var new_div = $("<div>"+msgs[i].u+":"+msgs[i].m+"</div>"); // create a new div
  		// 		var mesaj = $("#templates>.mesaj").clone();
				// mesaj.find(".title").html(msgs[i].u); //set .title element of the card
				// mesaj.find(".content").html(msgs[i].m); //set .content element of the card
  		// 		$("#chat_box").append(mesaj);	
  		// 	}
  			
		})

  	},
  	updateNews: function(){
		var news = test_news;
		$("#news").html(""); // we empty the contents of the page
		for(var i=0; i<news.length; i++)
		{
			var card = $("#templates>.card").clone();
			card.find(".title").html(news[i].title); //set .title element of the card
			card.find(".content").html(news[i].content); //set .content element of the card
			card.find(".img-container>img").attr("src",news[i].image); //set src attribute of the image
			card.attr("data-pk",news[i].pk); //set a custom pk attribute to store the pk
			card.find(/*selector of the read more button*/).click(function()
			{
		  	//on click display in console the pk of the clicked card
		  		console.log($(this).parent().parent().attr("data-pk"));
				});
		$("#news").append(card); //add card to page
		}
	},
	addData: function(){
		iter=iter+1;
		var a=Math.floor(Math.random()*100);
		date.push(a);
		console.log(date);
	},
	makeChart: function(){
		var ctx = $("#myChart");
		var mychart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: ["0","1","2","3","4","5","6","7","8","9"],
		        datasets: [{
		            label: '# of Votes',
		            data: date,
		            backgroundColor: [
		                'rgba(0, 0,0, 0.3)',
		                'rgba(54, 162, 235, 0.2)',
		                'rgba(255, 206, 86, 0.2)',
		                'rgba(75, 192, 192, 0.2)',
		                'rgba(153, 102, 255, 0.2)',
		                'rgba(255, 159, 64, 0.2)'
		            ],
		            borderColor: [
		                'rgba(0,0,0,1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
		setInterval(function(){
			//app.addData();
			$.get('http://192.168.1.185/chart', function(datele){
				++iter;
				//var a=Math.floor(Math.random()*100);
				//mychart.data.datasets[0].data.push(a);
				mychart.data.labels.push(iter);
				mychart.data.labels=mychart.data.labels.slice(-10);
				//mychart.data.datasets[0].data=mychart.data.datasets[0].data.slice(-10);
				datele=datele.slice(-10);
				mychart.data.datasets[0].data=datele;
				mychart.update();
				//console.log(datele);
			});
		}, 2000);
	// $("#chart").append(mychart); //add card to page

	},
	colorSet: function(){
		var col=$("#color").val();
		$("body").css("backgroundColor", col);
		localStorage.setItem('BGC',col);
	},
	getSettings: function(){
		var col=localStorage.getItem('BGC');
		$("body").css("backgroundColor", col);
	},
	Photo: function(){
		//alert("Buton apasat");
		alert(navigator.camera);
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
	    destinationType: Camera.DestinationType.FILE_URI });

	function onSuccess(imageURI) {
	   	$("#image").append("<img>"+imageURI+"</img>");
	}

	function onFail(message) {
	    alert('Failed because: ' + message);
	}
	},
	updateMap: function()
	{
		//console.log("Aici");
     //    navigator.geolocation.getCurrentPosition(showPosition);
    	// function showPosition(pozi)
    	// {
    	// 	console.log(aici);
    	// 	var latlon = pozi.coords.latitude + "," + pozi.coords.longitude;
    	// 	console.log(latlon);
    	// }

    	function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
          	console.log("aici");
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
        }
	},
	getACC: function()
	{
		var ctx = $("#acChart");
		var mychart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: ["0"],
		        datasets: [{
		            label: 'Acceleraion on Z',
		            data: date,
		            backgroundColor: [
		                'rgba(0, 0,0, 0.3)',
		            ],
		            borderColor: [
		                'rgba(0,0,0,1)',
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
		setInterval(function(){
			//app.addData();
			navigator.accelerometer.watchAcceleration(function(datele)
			{
				++iter;
				//var a=Math.floor(Math.random()*100);
				//mychart.data.datasets[0].data.push(a);
				mychart.data.labels.push(iter);
				mychart.data.labels=mychart.data.labels.slice(-20);
				//mychart.data.datasets[0].data=mychart.data.datasets[0].data.slice(-10);
				mychart.data.datasets[0].data.push(datele.z);
				mychart.data.datasets[0].data=mychart.data.datasets[0].data.slice(-20);
				mychart.update();
				//console.log(datele);
			},function(){},{ frequency: 1000 });
		}, 1000);
	},
	getWeather: function()
	{
		var oras=$("#city").val();
		var poza;
		$.getJSON("https://www.googleapis.com/customsearch/v1?key=AIzaSyBriptHm8-Tc0gjfsrM0FgD626h8Ve13iQ&cx=004800320405735125135:drr_tt3z3am&q="+oras+"+landscape&searchType=image&imgSize=large&alt=json",function(res)
		{
			//console.log(res.items[0].link);
			poza=res.items[0].link;
			console.log(poza);
			$.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+oras+"&appid=8e459effc6168163b4eaaf8d4193f3f8",function(json)
			{
				var card = $("#templates>.weathercard").clone();
				card.find(".img-container>img").attr("src",res.items[0].link);
				card.find(".title").html(json.name); 
				card.find(".content").html("Temperature:"+Math.floor(json.main.temp-273.15)+"°C");
				$("#weacards").append(card);
			});
		});

		// imageSearch = new google.search.ImageSearch();
		// imageSearch.execute(oras);
		// var poza=imageSearch.results[0];
		// console.log(imageSearch.results[0]);
		
	},
	addSwipe: function()
	{
		$(document).on("pagecreate","#wea",function()
		{
		  $("div.weathercard").on("swipe",function()
		  {
		    $(this).hide();
		  });
		});
	},
	
	startDash: function()
	{
		google.charts.load ('current', {'packages':['gauge']});
	},

	Led: function()
	{
		++onoff;
		onoff%=2;
		if(onoff==1)
		{
		  var apr=
		  {
		    'apr':1
		  }
		}
		else
		var apr=
		{
		  'apr':0
		}
		$.post('http://192.168.1.213/ceva',apr);
	},

	ShowTemp: function()
	{
		$("#chart_div").append("");
		var chartData = null;
		var chart =null;
		var options=
		{
		  width:400,
		  height:120,
		  redFrom:50,
		  redTo:100,
		  yellowFrom:25,
		  yellowTo:50,
		  max: 100
		};

		google.charts.setOnLoadCallback(drawChart);
		function drawChart()
		{
		  chartData=google.visualization.arrayToDataTable([['Label','Value'],['°C',0]]);
		  chart=new google.visualization.Gauge(document.getElementById('chart_div'));
		  chart.draw(chartData, options);
		}
		setInterval(getTemp,1000);
		function getTemp()
		{
			console.log("Temp")
			$.getJSON("http://192.168.1.213/phone",function(res)
			{
				console.log(res.temp)
				tmp=res.temp;
				chartData.setValue(0,1,tmp);
				chart.draw(chartData, options);
			});
		}

	},

	ShowLum: function()
	{
		$("#chart_div").append("");
		var chartData = null;
		var chart =null;
		var options=
		{
		  width:400,
		  height:120,
		  redFrom:800,
		  redTo:1023,
		  yellowFrom:200,
		  yellowTo:800,
		  max: 1023
		};

		//google.charts.load ('current', {'packages':['gauge']});
		google.charts.setOnLoadCallback(drawChart);
		function drawChart()
		{
		  chartData=google.visualization.arrayToDataTable([['Label','Value'],['lucsi-ish',0]]);
		  chart=new google.visualization.Gauge(document.getElementById('chart_div'));
		  chart.draw(chartData, options);
		}
		setInterval(getLum,1000);
		function getLum()
		{
			console.log("Temp")
			$.getJSON("http://192.168.1.213/phone",function(res)
			{
				console.log(res.lum)
				lum=res.lum;
				chartData.setValue(0,1,lum);
				chart.draw(chartData, options);
			});
		}
	},

	getTrip: function()
	{
	var org = $("#origin").val(); //get username
	var dest = $("#destination").val(); // get msg
	var req=
	{
	  "request": {
	    "slice": [
	      {
	        "origin": org,
	        "destination": dest,
	        "date": "2016-06-25"
	      }
	    ],
	    "passengers": {
	      "adultCount": 1,
	      "infantInLapCount": 0,
	      "infantInSeatCount": 0,
	      "childCount": 0,
	      "seniorCount": 0
	    },
	    "solutions": 1,
	    "refundable": false
	  }
	};
	//console.log(req);
	$.ajax({
     type: "POST",
     //Set up your request URL and API Key.
     url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBriptHm8-Tc0gjfsrM0FgD626h8Ve13iQ", 
     contentType: 'application/json', // Set Content-type: application/json
     dataType: 'json',
     // The query we want from Google QPX, This will be the variable we created in the beginning
     data: JSON.stringify(req),
     success: function (rasp) {
      //console.log(rasp);
      var orase=rasp.trips.data.city;
      for(i=0;i<orase.length;++i)
      {
		var mesaj = $("#templates>.mesaj").clone();
		mesaj.find(".title").html(orase[i].name); //set .title element of the card
		mesaj.find(".content").html(rasp.trips.data.airport[i].name); //set .content element of the card
		$("#trip_box").append(mesaj);
	  }
	  var suma=rasp.trips.tripOption[0].saleTotal;
	  $("#trip_box").append(suma);
      //console.log(orase[0].name);
	  //var suma=rasp.trips.tripOption[0].saleTotal;
	  // $("#trip_box").append(suma);
	 //  for(i=0;i<orase.length;++i)
	 //  {
	 //  	//console.log(orase[i].name);
	 //  	var geocoder = new google.maps.Geocoder();
		// if (geocoder) {
		// 	console.log(orase[i].name);
		//   geocoder.geocode({ 'address': orase[i].name }, function (res2, status) {
		//      if (status == google.maps.GeocoderStatus.OK) {
		//      	console.log(res2);
		//         flightPlanCoordinates.push({"lat": res2[0].geometry.location.lat, "lng": res2[0].geometry.location.lng});
		//      }
		//      else {
		//         console.log("Geocoding failed: " + status);
		//      }
		//   });
		// }    
	 //  			//console.log(orase[i]);
	 //  			//flightPlanCoordinates.push({"lat": res2[0].geometry.location.lat, "lng": res2[0].geometry.location.lng});
	 //  }
	 //  console.log(flightPlanCoordinates);

    },
      error: function(){
       //Error Handling for our request
       alert("Access to Google QPX Failed.");
     }
    });
	}
	
};

