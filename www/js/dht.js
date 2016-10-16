moment.locale('sl');
$(document).ready(function(){
    var dataTable = $('#data-table'),
        d = moment().startOf('day'),
        secondsStep = 300,
        momentDateTimeDisplayFormat = 'LL ob LT';
    getDataFromService(d.format('YYYY-MM-DD')).then(function(r){
        dataTable.empty();
        dataTable.append($(
            '<tr>' +
                '<th>Čas<th>' +               
                '<th>Temperatura<th>' +                 
                '<th>Vlaga<th>' +                 
            '</tr>'                        
        ));
        for(var i=0; i<r.length; i++) {
            dataTable.append($(
                '<tr>' +
                    '<td>' + r[i].d.format(momentDateTimeDisplayFormat) + '<td>' +               
                    '<td>' + r[i].t + ' °<td>' +                 
                    '<td>' + r[i].h + ' %<td>' +                 
                '</tr>'                        
            ));
        }
        drawD3Chart(d,r);
    });
});
function drawD3Chart(date,data){
    var chartData = prepareDataForD3ChartDisplay(date,300,data);
    nv.addGraph(function() {
        var chart = nv.models.linePlusBarChart()
                .margin({top: 30, right: 60, bottom: 50, left: 70})
                .x(function(d,i) { return i })
                .y(function(d,i) {return d[1] })
                ;

        chart.xAxis.tickFormat(function(d) {
            var dx = chartData[0].values[d] && chartData[0].values[d][0] || 0;
            return d3.time.format('%X')(new Date(dx))
        });
        //chart.xScale(d3.time.scale());
        chart.xAxis.ticks(5);
        //d3.time.scale.utc();
        //chart.xAxis.ticks(d3.time.hours, 1)
        /*
        chart.xAxis
         .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); })
        */
        chart.y1Axis
            .tickFormat(function(d) { return d3.format('.1f')(d)+'%'});

        chart.y2Axis
            .tickFormat(function(d) { return d3.format('.1f')(d)+'°'});

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
function prepareDataForD3ChartDisplay(startDate,step,data){
    var temperatures = { 
        key : "Temperature" ,
        color: "#f00",
        values : []
    },
    humidities = { 
        key : "Humidity" ,
        color: "#ccf",
        bar: true,
        values : []
    };
    if(data&&data.length>0){
        var t = data[0].t,
            h = data[0].h,
            finishDate = startDate.clone().add(1, 'days'),
            date = startDate.clone(),
            i = 0;
        while(date<=finishDate){
            while(i<data.length&&data[i].d<=date){
                t = data[i].t;
                h = data[i].h;
                i++;
            }
            temperatures.values.push([date,t]);
            humidities.values.push([date,h]);      
            date = date.clone();
            date.add(step,'seconds');
        }
    }
    console.log(temperatures);
    return [temperatures,humidities];
}
function getDataFromService(date){
    var dfd = jQuery.Deferred();
    jQuery.getJSON( 'http://192.168.0.19:8888/'+date,{},function(r){
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