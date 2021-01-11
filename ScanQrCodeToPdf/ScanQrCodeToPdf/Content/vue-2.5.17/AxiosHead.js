/// <reference path="../abp-web-resources/abp.js" />
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsInN1YiI6IjEwMzMiLCJqdGkiOiI4OWY5NjVhZC1hOTA2LTQyNjktOTkzNy1hZTNlZWQ5NzE0ODEiLCJpYXQiOjE1MzU5NDQxMzAsIm5iZiI6MTUzNTk0NDEzMCwiZXhwIjoxNTY3NDgwMTMwLCJpc3MiOiJNeUFCUFZ1ZUNvcmUiLCJhdWQiOiJNeUFCUFZ1ZUNvcmUifQ.OjLKgE5aZRPjPQ_0R-lQxyQvU66dOpiNuZZmFi0efZc';
//var baseUrl = 'https://appapi.yunyutian.cn';
//var baseUrl = 'http://localhost:12170';  //正式12169
var baseUrl = 'https://tapi.yunyutian.cn';

var formatterTooltip = function (params)
{
    var objList = new Array();
    //需要创建一个对象把数据进行排序
    function ObjData(name, color, seriesName, value)
    {
        this.color = color;
        this.seriesName = seriesName;
        this.value = value;
        this.name = name;
    };
    //得到需要的集合
    for (var i = 0; i < params.length; i++)
    {
        // console.log(params[i].value);
        objList.push(new ObjData(params[i].name, params[i].color, params[i].seriesName, typeof (params[i].value) == 'undefined' ? 0 : params[i].value));
    }
    //排序
    objList.sort(function (a, b)
    {
        return b.value - a.value
    });

    var html = "";
    var dataName = "";
    for (var i = 0; i < objList.length; i++)
    {
        //   console.log(objList[i].value);
        if (!dataName)
        {
            dataName = objList[i].name;
        }
        html += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + objList[i].color + '"></span>' + objList[i].seriesName + ':' + (objList[i].value == 0 ? '' : objList[i].value) + '<br/>';
    }
    html = dataName + '<br/>' + html;
    return html;
};