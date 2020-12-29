/**
 * 
 * @param {*} opts 
 * typeName 服务名称
 * propertyName 字段名称
 * queryData 参数相关
 *      type 查询的类别（1-点 2-线 3-面）
 *      coors 面查询时 面的坐标
 *      
 */

function queryWFSData(opts) {
    var parameters = {
        service: "WFS",
        request: "GetFeature",
        typeName: opts.typeName, 
        version: "1.0.0",
        outputFormat: "application/json",
        maxFeatures: 200
    };
    var filter = '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">';
    
    //请求的wfs参数
    if (!opts.queryData) { 
        console.warn("查询传入参数有误！");
        return;
    }
    var type = opts.queryData.type; // 查询的类别
    var coors = opts.queryData.coors; // 查询的坐标（面）
    if (type == 1) { //点查询
        if (coors.length < 1) {
            console.warn("查询传入坐标有误！");
            return;
        }
        var point = "";
        for (var i = 0; i < coors.length; i++) {
            point += coors[i][0] + "," + coors[i][1] + " ";
        }
        filter += `
            <Intersects>
                <PropertyName>${opts.propertyName}</PropertyName>
                <gml:Point>
                    <gml:coordinates>${point}</gml:coordinates>
                </gml:Point>
            </Intersects>
        `
    } else if (type == 2) { //线查询
        if (coors.length < 1) {
            console.warn("查询传入坐标有误！");
            return;
        }
        if (coors && coors.length > 0) {
            var polyline = "";
            for (var i = 0; i < coors.length; i++) {
                polyline += coors[i][0] + "," + coors[i][1] + " ";
                if(i==coors.length-1){
                    polygon += coors[0][0] + "," + coors[0][1] + " ";
                }
            }
            filter += `
            <Within>
                <PropertyName>${opts.propertyName}</PropertyName>
                <gml:LineString>
                <gml:coordinates>${polyline}</gml:coordinates>
                </gml:LineString>
            </Within>`
        }
    } else if (type == 3) { //面查询
        if (coors.length < 1) {
            console.warn("查询传入坐标有误！");
            return;
        }
        if (coors && coors.length > 0) {
            var polygon = "";
            for (var i = 0; i < coors.length; i++) {
                polygon += coors[i][0] + "," + coors[i][1] + " ";
                if(i==coors.length-1){
                    polygon += coors[0][0] + "," + coors[0][1] + " ";
                }
            }
            filter += `
            <Intersects>
                <PropertyName>${opts.propertyName}</PropertyName>
                <gml:Polygon>
                    <gml:outerBoundaryIs>
                        <gml:LinearRing>
                            <gml:coordinates>${polygon}</gml:coordinates>
                        </gml:LinearRing>
                    </gml:outerBoundaryIs>
                </gml:Polygon>
            </Intersects>`
        }
    } else { //属性查询
        if (opts.queryData.propertyValue) {
            filter += ` 
                    <PropertyIsLike wildCard="*" singleChar="#" escapeChar="!"> 
                        <PropertyName>${opts.propertyName}</PropertyName>
                        <Literal>*${opts.queryData.propertyValue}*</Literal>
                    </PropertyIsLike>`
        }
    }
    filter += '</Filter>';
    parameters.filter = filter;
    var url = opts.url;
    $.ajax({
        url: url,
        type: "get",
        data: parameters,
        success: function (featureCollection) {
            if (opts.success) opts.success(featureCollection);
        },
        error: function (data) {
            console.warn("请求出错(" + data.status + ")：" + data.statusText);
        }
    });
}