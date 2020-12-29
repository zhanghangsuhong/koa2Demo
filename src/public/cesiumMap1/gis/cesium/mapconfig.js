/* --------------------------------地图初始信息配置-------------------------------- */
function MapConfig() { }
MapConfig.geoserverUrl = "/geowebcache/";//geoserver服务URL
MapConfig.geoserverWorkspace = "DGSYS";//geoserver工作区
MapConfig.geoserverTypeName = "JZPolygonWgs84";//geoserver图层服务名称
MapConfig.geoserverPropertyName = "name";//geoserver图层属性字段name
MapConfig.geoserverPropertyId = "Id";//geoserver图层属性字段id
MapConfig.geoserverGeomName = "the_geom";//geoserver图层几何字段the_geom"
// 预定义查询哪些属性
MapConfig.ppObj = {
    "_name": "名称",
    "_address": "地址"
}
/*!
 *三维部分配置文件
 *cesium
 */
MapConfig.mapInitParams = {
    extent: {//初始化范围
        xmin: 12445986.749812808,
        ymin: 2460330.5958780753,
        xmax: 12450572.971510038,
        ymax: 2462313.1812992743
    },
    spatialReference: {//地图空间参考坐标系
        wkid: 3857
    },
    /*备注说明:配置底图列表
     *type代表地图服务类型(0代表ArcGisMapServerImageryProvider;1代表createOpenStreetMapImageryProvider;
                     2代表WebMapTileServiceImageryProvider;3代表createTileMapServiceImageryProvider;
                     4 代表UrlTemplateImageryProvider;5 代表WebMapServiceImageryProviderr)
     *proxyUrl代理请求服务
     *iconUrl图标
     *name显示名称
     *Url地图Url
     */
    imageryViewModels: [
        { "id": 0, "label": "影像图", className: "imgType", type: 0, proxyUrl: '', Url: 'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer' },
        { "id": 1, "label": "街道图", className: "vecType", type: 0, proxyUrl: '', Url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer' },
        { "id": 2, "label": "WMS", className: "imgType", type: 5, proxyUrl: '', Url: MapConfig.geoserverUrl + 'service/wms', credit: 'wms服务', layers: 'worldMap' },
        //{"id":2,"label":"WMS",className:"imgType",type:5,proxyUrl:'',Url:MapConfig.geoserverUrl+'service/wms',credit:'wms服务',layers: 'worldMap',tilingScheme:new Cesium.WebMercatorTilingScheme()},
        { "id": 3, "label": "OSM", className: "vecType", type: 1, proxyUrl: '', Url: 'https://a.tile.openstreetmap.org/' },
        { "id": 4, "label": "天地街道", className: "vecType", type: 2, proxyUrl: '', Url: 'http://t{l}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles&tk=7786923a385369346d56b966bb6ad62f', layer: 'tdtVecBasicLayer', style: 'default', format: 'image/jpeg', tileMatrixSetID: 'tdtMap' },
        { "id": 5, "label": "天地影像", className: "imgType", type: 2, proxyUrl: '', Url: 'http://t{l}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles&tk=7786923a385369346d56b966bb6ad62f', layer: 'tdtImgBasicLayer', style: 'default', format: 'image/jpeg', tileMatrixSetID: 'tdtMap' },
    ],

}
//Cesium动态叠加createWorldTerrain地形图,针对cesium 1.52版本api
//MapConfig.terrainObj = {type:"createWorldTerrain",requestWaterMask:false,requestVertexNormals:false,proxyUrl:""};//在线地形
MapConfig.terrainObj = { type: "CesiumTerrainProvider", url: "http://data.marsgis.cn/terrain", requestWaterMask: false, requestVertexNormals: false, proxyUrl: "" };//在线地形
//MapConfig.terrainObj = {type:"CesiumTerrainProvider",url:"http://localhost:8180/cesium/worldTerrain",requestWaterMask:false,requestVertexNormals:false,proxyUrl:""};//离线地形
/*地图图层菜单目录构造*/
/*
 *name-图层名称
 *layerurl-图层服务配置
 *type代表地图服务类型:
 0代表ArcGisMapServerImageryProvider;
 1代表createOpenStreetMapImageryProvider;
 2代表WebMapTileServiceImageryProvider;
 3代表createTileMapServiceImageryProvider;
 4 代表UrlTemplateImageryProvider;
 5 代表WebMapServiceImageryProviderr(WMS);
 6 代表kml,kmz;
 7 代表geoJson;
 *layerid-图层id
 */
MapConfig.Layers = [
    { id: 1, pId: 0, name: "全球地理信息数据服务", checked: false },
    { id: 2, pId: 1, name: "基础空间数据", checked: false },
    {
        id: 11,
        pId: 2,
        name: "视频",//WMS-T
        layerurl: MapConfig.geoserverUrl + "service/wms",
        layerid: "YJZPSYS:YJ_ZPYG_SP",
        position: Cesium.Cartesian3.fromDegrees(111.825662, 21.581396, 3000),//图层定位位置,经纬度以及高度
        IsWebMercatorTilingScheme: true,//是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 5,
        checked: false
    },
    {
        id: 12,
        pId: 2,
        name: "港路",//WMS-T
        layerurl: MapConfig.geoserverUrl + "service/wms",
        layerid: "YJZPSYS:YJ_ZPYG_DL",
        position: Cesium.Cartesian3.fromDegrees(111.825662, 21.581396, 3000),//图层定位位置,经纬度以及高度
        IsWebMercatorTilingScheme: true,//是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 5,
        checked: false
    },

    {
        id: 13,
        pId: 2,
        name: "岸线",//WMS-T
        layerurl: MapConfig.geoserverUrl + "service/wms",
        layerid: "YJZPSYS:YJ_ZPYG_HAX",
        position: Cesium.Cartesian3.fromDegrees(111.825662, 21.581396, 3000),//图层定位位置,经纬度以及高度
        IsWebMercatorTilingScheme: true,//是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 5,
        checked: false
    },
    {
        id: 14,
        pId: 2,
        name: "泊位",//WMS-T
        layerurl: MapConfig.geoserverUrl + "service/wms",
        layerid: "YJZPSYS:YJ_ZPYG_BW",
        position: Cesium.Cartesian3.fromDegrees(111.825662, 21.581396, 3000),//图层定位位置,经纬度以及高度
        IsWebMercatorTilingScheme: true,//是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 5,
        checked: false
    },

    {
        id: 15,
        pId: 2,
        name: "码头",//WMS-T
        layerurl: MapConfig.geoserverUrl + "service/wms",
        layerid: "YJZPSYS:YJ_ZPYG_MT",
        position: Cesium.Cartesian3.fromDegrees(111.825662, 21.581396, 3000),//图层定位位置,经纬度以及高度
        IsWebMercatorTilingScheme: true,//是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 5,
        checked: false
    },
    {
        id: 16,
        pId: 2,
        name: "港池",//WMS-T
        layerurl: MapConfig.geoserverUrl + "service/wms",
        layerid: "YJZPSYS:YJ_ZPYG_GC",
        position: Cesium.Cartesian3.fromDegrees(111.825662, 21.581396, 3000),//图层定位位置,经纬度以及高度
        IsWebMercatorTilingScheme: true,//是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 5,
        checked: false
    },

    {
        id: 17,
        pId: 2,
        name: "护岸",//WMS-T
        layerurl: MapConfig.geoserverUrl + "service/wms",
        layerid: "YJZPSYS:YJ_ZPYG_HA",
        position: Cesium.Cartesian3.fromDegrees(111.825662, 21.581396, 3000),//图层定位位置,经纬度以及高度
        IsWebMercatorTilingScheme: true,//是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 5,
        checked: false
    },
    {
        id: 18,
        pId: 2,
        name: "防波堤",//WMS-T
        layerurl: MapConfig.geoserverUrl + "service/wms",
        layerid: "YJZPSYS:YJ_ZPYG_FBD",
        position: Cesium.Cartesian3.fromDegrees(111.825662, 21.581396, 3000),//图层定位位置,经纬度以及高度
        IsWebMercatorTilingScheme: true,//是否创建摩卡托投影坐标系,默认是地理坐标系
        type: 5,
        checked: false
    }
];
//配置热点定位信息
MapConfig.locations = {
    url: GLOBAL.domainResource + "/gis/cesium/images/yellow.png",
    width: 26,
    height: 48,
    type: "infoWindow",
    models: [
        { id: "location_1", name: "旅游观光码头", location: [111.826, 21.576] },
        { id: "location_2", name: "一期码头", location: [111.831, 21.582] },
        { id: "location_3", name: "卸鱼码头", location: [111.827, 21.587] }
    ]
};
/*三维倾斜摄影配置信息*/
MapConfig.Tiles3D = {
    url: "/cesium/3DModel/test/3Dtiles/pazhou/Production_3.json"
};
/*三维模型gltf配置信息*/
MapConfig.mapPosition = Cesium.Cartesian3.fromDegrees(102.468086, 37.933179, 3500);
MapConfig.position = Cesium.Cartesian3.fromDegrees(102.468086, 37.933179);
MapConfig.Obj3D = {
    position: MapConfig.mapPosition,
    models: [
        {
            id: "1_db",
            name: "测试3D模型1_db",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_db.gltf"
        },
        {
            id: "1_deng",
            name: "测试3D模型1_deng",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_deng.gltf"
        },
        {
            id: "1_men",
            name: "测试3D模型1_men",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_men.gltf"
        },
        {
            id: "1_my",
            name: "测试3D模型1_my",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_my.gltf"
        },
        {
            id: "1_pao",
            name: "测试3D模型1_pao",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_pao.gltf"
        },
        {
            id: "1_w",
            name: "测试3D模型1_w",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_w.gltf"
        },
        {
            id: "1_wd",
            name: "测试3D模型1_wd",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_wd.gltf"
        },
        {
            id: "1_wl",
            name: "测试3D模型1_wl",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_wl.gltf"
        },
        {
            id: "1_wq",
            name: "测试3D模型1_wq",
            type: "gltf",
            position: MapConfig.position,
            uri: "/cesium/3DModel/test/gltf/1_wq.gltf"
        }

    ]
};
/*配置三维模型gltf气泡窗口内容模拟数据源*/
MapConfig.Obj3Djson = [
    {
        id: "1_db",
        name: "测试3D模型1_db",
        address: "测试3D模型地址"
    },
    {
        id: "1_deng",
        name: "测试3D模型1_deng",
        address: "测试3D模型地址"
    },
    {
        id: "1_men",
        name: "测试3D模型1_men",
        address: "测试3D模型地址"
    },
    {
        id: "1_my",
        name: "测试3D模型1_my",
        address: "测试3D模型地址"
    },
    {
        id: "1_pao",
        name: "测试3D模型1_pao",
        address: "测试3D模型地址"
    },
    {
        id: "1_w",
        name: "测试3D模型1_w",
        address: "测试3D模型地址"
    },
    {
        id: "1_wd",
        name: "测试3D模型1_wd",
        address: "测试3D模型地址"
    },
    {
        id: "1_wl",
        name: "测试3D模型1_wl",
        address: "测试3D模型地址"
    },
    {
        id: "1_wq",
        name: "测试3D模型1_wq",
        address: "测试3D模型地址"
    }

];
/*配置倾斜模型3dtiles气泡窗口内容模拟数据源*/
MapConfig.Obj3Dtilesjson = [
    {
        id: "0",
        name: "琶洲测试建筑1",
        address: "琶洲测试建筑地址1"
    },
    {
        id: "1",
        name: "琶洲测试建筑2",
        address: "琶洲测试建筑地址2"
    },
    {
        id: "2",
        name: "琶洲测试建筑3",
        address: "琶洲测试建筑地址3"
    },
    {
        id: "3",
        name: "琶洲测试建筑4",
        address: "琶洲测试建筑地址4"
    },
    {
        id: "4",
        name: "琶洲测试建筑5",
        address: "琶洲测试建筑地址5"
    },
    {
        id: "5",
        name: "琶洲测试建筑6",
        address: "琶洲测试建筑地址6"
    }

];
