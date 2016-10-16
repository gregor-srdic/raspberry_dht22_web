moment.locale('sl');
var demo = false,
    displayFormats = {
    momentDateTime : 'LL ob LT',
    momentTime : 'LT',
    momentRequestDate : 'YYYY-MM-DD'
};
$(document).ready(function(){
    var dataTable = $('#data-table'),
        d = moment().startOf('day'),
        secondsStep = 300;
    getDataFromService(d.format(displayFormats.momentRequestDate)).then(function(r){
        dataTable.empty();
        dataTable.append($(
            '<tr>' +
                '<th>Čas<th>' +               
                '<th>Temperatura<th>' +                 
                '<th>Vlaga<th>' +                 
            '</tr>'                        
        ));
        for(var i=r.length-1; i>-1; i--) {
            dataTable.append($(
                '<tr>' +
                    '<td>' + r[i].d.format(displayFormats.momentDateTime) + '<td>' +               
                    '<td>' + r[i].t + ' °<td>' +                 
                    '<td>' + r[i].h + ' %<td>' +                 
                '</tr>'                        
            ));
        }
        drawD3Chart(d,r);
        //drawFusionChart();
    });
});
function drawD3Chart(date,data){
    var chartData = prepareDataForD3ChartDisplay(date,300,data);
    var tickValues = getD3TicksValues(chartData,4);
    nv.addGraph(function() {
        d3.time.scale.utc();
        var chart = nv.models.linePlusBarChart()
                .margin({top: 20, right: 70, bottom: 50, left: 70})
                .focusEnable(false)        
                .x(function(d,i) {return d[0]; })
                .y(function(d,i) {return d[1]; })
                .showLegend(false)
                ;
        chart.tooltip.enabled(true);
        chart.tooltip.contentGenerator(function(d) {
            var index = d.point ? d.pointIndex : d.index;
            var x = chartData[0].values[index][0],
                t = chartData[0].values[index][1],
                h =  chartData[1].values[index][1];
            return  '<div class="chart-toolbar">' +
                    '<div class="timestamp"><b>' +  moment(x).format(displayFormats.momentDateTime) + '</b></div>' +
                    '<div class="temperature">Temperature: <b>' +  d3.format('.1f')(t) + '°</b></div>' +
                    '<div class="humidity">Humidity: <b>' +  d3.format('.1f')(h) + '%</b></div>' +
                    '</div>'  
        });
        chart.xScale(d3.time.scale());
        chart.xAxis
            .showMaxMin(false)
            .tickValues(tickValues)
            .tickFormat(function(d,i) {
                if(i!==undefined)
                    return moment(d).format(displayFormats.momentTime);
                return moment(d).format(displayFormats.momentDateTime);
            })
        ;
        chart.y1Axis
            .showMaxMin(false)
            .tickFormat(function(d,i) {
                if(i!==undefined)
                    return d3.format('.f')(d)+'%'
                return d3.format('.1f')(d)+'%'
            })
        ;
        chart.y2Axis
            .showMaxMin(false)
            .tickFormat(function(d,i) { 
                if(i!==undefined)
                    return d3.format('.f')(d)+'°'
                return d3.format('.1f')(d)+'°'
            })
        ;
        chart.forceY([18,28]);
        chart.bars.forceY([0,100]);
        d3.select('#chart svg')
            .datum(chartData)
            .transition()
            .duration(0)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
    });
}
function drawFusionChart(){
      $("#fusion-chart-container").insertFusionCharts({
        type: "mscombidy2d",
        height: "350",
        dataFormat: "json",
        dataSource: {
            "chart": {
                "caption": "Actual Revenues, Targeted Revenues & Profits",
                "subcaption": "Last year",
                "xaxisname": "Month",
                "yaxisname": "Amount (In USD)",
                "numberprefix": "$",
                "theme": "ocean",
            },
            "categories": [
                {
                    "category": [
                        {
                            "label": "Jan"
                        },
                        {
                            "label": "Feb"
                        },
                        {
                            "label": "Mar"
                        },
                        {
                            "label": "Apr"
                        },
                        {
                            "label": "May"
                        },
                        {
                            "label": "Jun"
                        },
                        {
                            "label": "Jul"
                        },
                        {
                            "label": "Aug"
                        },
                        {
                            "label": "Sep"
                        },
                        {
                            "label": "Oct"
                        },
                        {
                            "label": "Nov"
                        },
                        {
                            "label": "Dec"
                        }
                    ]
                }
            ],
            "dataset": [
                {
                    "seriesname": "Actual Revenue",
                    "data": [
                        {
                            "value": "16000"
                        },
                        {
                            "value": "20000"
                        },
                        {
                            "value": "18000"
                        },
                        {
                            "value": "19000"
                        },
                        {
                            "value": "15000"
                        },
                        {
                            "value": "21000"
                        },
                        {
                            "value": "16000"
                        },
                        {
                            "value": "20000"
                        },
                        {
                            "value": "17000"
                        },
                        {
                            "value": "25000"
                        },
                        {
                            "value": "19000"
                        },
                        {
                            "value": "23000"
                        }
                    ]
                },
                {
                    "seriesname": "Projected Revenue",
                    "renderas": "line",
                    "showvalues": "0",
                    "data": [
                        {
                            "value": "15000"
                        },
                        {
                            "value": "16000"
                        },
                        {
                            "value": "17000"
                        },
                        {
                            "value": "18000"
                        },
                        {
                            "value": "19000"
                        },
                        {
                            "value": "19000"
                        },
                        {
                            "value": "19000"
                        },
                        {
                            "value": "19000"
                        },
                        {
                            "value": "20000"
                        },
                        {
                            "value": "21000"
                        },
                        {
                            "value": "22000"
                        },
                        {
                            "value": "23000"
                        }
                    ]
                },
                {
                    "seriesname": "Profit",
                    "renderas": "area",
                    "parentYAxis": "S",
                    "showvalues": "0",
                    "data": [
                        {
                            "value": "4000"
                        },
                        {
                            "value": "5000"
                        },
                        {
                            "value": "3000"
                        },
                        {
                            "value": "4000"
                        },
                        {
                            "value": "1000"
                        },
                        {
                            "value": "7000"
                        },
                        {
                            "value": "1000"
                        },
                        {
                            "value": "4000"
                        },
                        {
                            "value": "1000"
                        },
                        {
                            "value": "8000"
                        },
                        {
                            "value": "2000"
                        },
                        {
                            "value": "7000"
                        }
                    ]
                }
            ]
        }
    });
}
function prepareDataForFusionChartDisplay(startDate,step,data){
}
function prepareDataForD3ChartDisplay(startDate,step,data){
    var temperatures = { 
        key : "Temperature",
        color: "#f00",
        values : []
    },
    humidities = { 
        key : "Humidity",
        color: "#ccf",
        bar: true,
        values : []
    };
    if(data&&data.length>0){
        var t = data[0].t,
            h = data[0].h,
            finishDate = startDate.clone().add(1, 'days'),
            date = startDate.clone(),
            i = 0, x;
        while(date<=finishDate){
            while(i<data.length&&data[i].d<=date){
                t = data[i].t;
                h = data[i].h;
                i++;
            }
            x = date.toDate();
            temperatures.values.push([x,t]);
            humidities.values.push([x,h]);      
            date = date.clone();
            date.add(step,'seconds');
        }
    }
    return [temperatures,humidities];
}
function getD3TicksValues(d3data,count){
    d3data = d3data[0].values;
    var l = d3data.length,
        ticksValues = [d3data[0][0]];
    var d = Math.floor(l/count);
    var x = d;
    while(x<=l-d){
        ticksValues.push(d3data[x][0]);
        x += d;
    }
    ticksValues.push(d3data[l-1][0]);
    return ticksValues;
}
function getDataFromService(date){
    var dfd = jQuery.Deferred();
    if(demo)
        dfd.resolve(getDemoData());
    else
        jQuery.getJSON( 'http://192.168.0.19:8888/'+date,{},function(r){
            dfd.resolve(r);
        });
    dfd.then(function(r){
         if(r&&r.length>0){
            for(var i=0; i<r.length; i++)
                r[i].d = moment(r[i].d);
            r.sort(function(a,b){
                return a.d - b.d;
            });
        }
        dfd.resolve(r);
    });
    return dfd;
}