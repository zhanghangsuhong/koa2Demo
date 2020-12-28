define(function (require, exports, module) {
    var cesium = null;
    function init() {
        //地图初始化
        cesium = new CesiumViewer("cesiumMap", { mapInitParams: MapConfig.mapInitParams });
        //显示当前坐标
        cesium.show3DCoordinates();
        //调用接口-隐藏logo以及地图服务版权信息
        cesium.hideMapLogo();
        //添加导航指北针
        cesium.cesiumViewer.extend(Cesium.viewerCesiumNavigationMixin, { defaultResetView: cesium.defaultResetView });
        //加载地形图
        //监听check点击事件
        $("#cesium_Terrain input").bind("click", function () {
            if (this.checked) {
                cesium.addTerrainLayer(MapConfig.terrainObj);
            }
            else {
                cesium.romoveTerrainLayer();
            }
        })
        //底图切换
        cesium.loadSwitcherMap(MapConfig.mapInitParams.imageryViewModels);
        //显示图层控制器
        $("#cesium3DLayers").click(function () {
            cesium.show3DLayers(MapConfig.Layers);
        });
        //显示地图热点定位器
        $("#cesium3DLocation").click(function () {
            //加载地图热点定位器
            cesium.show3DLocator(MapConfig.locations);
        });
        //清空地图
        $("#cesiumClearData").click(function () {
            cesium.clearMap();
        });
        //显示地图复位
        $("#cesiumMapFull").click(function () {
            cesium.flyToRectangle(cesium.initExtent);
        });
        //显示地图卷帘
        $("#cesium3DSlider").click(function () {
            if ($(this).attr("class").indexOf("selected") != -1) {
                cesium.showCesiumSlider(3);
            } else {
                cesium.hideCesiumSlider();
            }
        });
        //量算工具
        var measureArr = [];
        $("#measureDistance").click(function () {
            var msd = new MeasureSpaceDistance(cesium.cesiumViewer, {});
            msd.start();
            measureArr.push(msd);
        });
        $("#measureGroundDistance").click(function () {
            var groundDistance = new MeasureGroundDistance(cesium.cesiumViewer);
            groundDistance.start();
            measureArr.push(groundDistance);
        });
        $("#measureArea").click(function () {
            var msa = new MeasureSpaceArea(cesium.cesiumViewer, {});
            msa.start();
            measureArr.push(msa);
        });
        //绘制工具Draw版本1
        var drawHelper = new DrawHelper(cesium.cesiumViewer);
        var toolbar = drawHelper.addToolbar(document.getElementById("toolbar"), {
            buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent']
        });
        toolbar.addListener('markerCreated', function (event) {
            //loggingMessage('Marker created at ' + event.position.toString());
            // create one common billboard collection for all billboards
            var b = new Cesium.BillboardCollection();
            cesium.cesiumViewer.scene.primitives.add(b);
            var billboard = b.add({
                show: true,
                id: "plot",
                position: event.position,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 1.0,
                image: GLOBAL.domainResource + '/gis/cesium/images/glyphicons_242_google_maps.png',
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            billboard.setEditable();
        });
        toolbar.addListener('polylineCreated', function (event) {
            //loggingMessage('Polyline created with ' + event.positions.length + ' points');
            var polyline = new DrawHelper.PolylinePrimitive({
                positions: event.positions,
                width: 5,
                type: "plot",
                geodesic: true
            });
            cesium.cesiumViewer.scene.primitives.add(polyline);
            polyline.setEditable();
            polyline.addListener('onEdited', function (event) {
                //loggingMessage('Polyline edited, ' + event.positions.length + ' points');
            });

        });
        toolbar.addListener('polygonCreated', function (event) {
            //loggingMessage('Polygon created with ' + event.positions.length + ' points');
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                type: "plot",
                material: Cesium.Material.fromType('Checkerboard')
            });
            cesium.cesiumViewer.scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function (event) {
                //loggingMessage('Polygon edited, ' + event.positions.length + ' points');
            });

        });
        toolbar.addListener('circleCreated', function (event) {
            //loggingMessage('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                type: "plot",
                material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            cesium.cesiumViewer.scene.primitives.add(circle);
            circle.setEditable();
            circle.addListener('onEdited', function (event) {
                //loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
            });
        });
        toolbar.addListener('extentCreated', function (event) {
            var extent = event.extent;
            //loggingMessage('Extent created (N: ' + extent.north.toFixed(3) + ', E: ' + extent.east.toFixed(3) + ', S: ' + extent.south.toFixed(3) + ', W: ' + extent.west.toFixed(3) + ')');
            var extentPrimitive = new DrawHelper.ExtentPrimitive({
                extent: extent,
                type: "plot",
                material: Cesium.Material.fromType(Cesium.Material.StripeType)
            });
            cesium.cesiumViewer.scene.primitives.add(extentPrimitive);
            extentPrimitive.setEditable();
            extentPrimitive.addListener('onEdited', function (event) {
                //loggingMessage('Extent edited: extent is (N: ' + event.extent.north.toFixed(3) + ', E: ' + event.extent.east.toFixed(3) + ', S: ' + event.extent.south.toFixed(3) + ', W: ' + event.extent.west.toFixed(3) + ')');
            });
        });
        $("#cesiumDrawToolbar").click(function () {
            if ($(this).attr("class").indexOf("selected") != -1) {
                $("#toolbar").show();
            } else {
                $("#toolbar").hide();
            }
        });

        //绘制工具版本2
        //绘制工具初始化
        var drawTool = new DrawTool({
            viewer: cesium.cesiumViewer,
            hasEdit: true
        });
        //绘制矩形
        $("#drawRectangle").click(function () {
            if (!drawTool) return;
            drawTool.startDraw({
                type: "rectangle",
                style: {
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                success: function (evt) { }
            });
        });
        //绘制线
        $("#drawPolyline").click(function () {
            if (!drawTool) return;
            drawTool.startDraw({
                type: "polyline",
                style: {
                    material: Cesium.Color.YELLOW,
                    clampToGround: true
                },
                success: function (evt) { }
            });
        });
        //绘制多边形
        $("#drawPolygon").click(function () {
            if (!drawTool) return;
            drawTool.startDraw({
                type: "polygon",
                style: {
                    clampToGround: true,
                    material: Cesium.Color.YELLOW,
                },
                success: function (evt) { }
            });
        });
        //绘制点
        $("#drawBillboard").click(function () {
            if (!drawTool) return;
            drawTool.startDraw({
                type: "billboard",
                style: {
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    image: GLOBAL.domainResource + "/gis/cesium/images/glyphicons_242_google_maps.png"
                },
                success: function (evt) { }
            });
        });
        //绘制圆
        $("#drawCircle").click(function () {
            if (!drawTool) return;
            drawTool.startDraw({
                type: "circle",
                style: {
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                success: function (evt) { }
            });
        });
        //清空图形
        $("#clearAll").click(function () {
            if (drawTool) {
                drawTool.destroy();
            }
        });

        //三维模型3DModels
        //为了适配模型的光源效果最佳状态，设置模型的当前光照时间，并且停止时间流动计算
        cesium.cesiumViewer.clockViewModel.currentTime = Cesium.JulianDate.fromIso8601('2018-01-29T12:00:00+08:00');//北京时间
        cesium.cesiumViewer.clockViewModel.shouldAnimate = false;
        cesium.cesiumViewer.clockViewModel.canAnimate = false;
        //cesium.cesiumViewer.scene.sun = new Cesium.Sun();
        //cesium.cesiumViewer.scene.sun.glowFactor = 10;//默认1.0
        //设置当前时间，并且恢复时间流动计算
        /*cesium.cesiumViewer.clockViewModel.currentTime = Cesium.JulianDate.fromDate(new Date());//北京时间
        cesium.cesiumViewer.clockViewModel.shouldAnimate = true;
        cesium.cesiumViewer.clockViewModel.canAnimate  = true;*/
        $("#cesium3DModel").click(function () {
            if ($(this).attr("class").indexOf("selected") != -1) {
                cesium.add3DGlft(MapConfig.Obj3D);
                $("#showListsDIV").show();
                //移除地形加载
                cesium.romoveTerrainLayer();
                $("#cesium_Terrain").find("input").prop("checked", false);
            } else {
                if (cesium.cesiumViewer.entities._entities && cesium.cesiumViewer.entities._entities.length > 0) {
                    cesium.cesiumViewer.entities.removeAll();//清空所有模型
                    $("#showListsDIV").hide();
                }
            }
        });

        /**
         * 根据id匹配对应的模型
         * @param  id gltf模型id
         */
        function toLocationGltf(id) {
            var entity = cesium.cesiumViewer.entities.getById(id);
            if (entity instanceof Cesium.Entity) {
                for (var i = 0; i < MapConfig.Obj3Djson.length; i++) {
                    var data = MapConfig.Obj3Djson[i];
                    if (id == data.id) {
                        var content =
                            "<div>" +
                            "<span>名称:</span><span>" + data.name + "</span></br>" +
                            "<span>地址:</span><span>" + data.address + "</span></br>" +
                            "</div>";
                        var cartographic = Cesium.Cartographic.fromCartesian(entity._position._value);//世界坐标转地理坐标（弧度）
                        //var point=[ cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];//地理坐标（弧度）转经纬度坐标

                        var point = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];//地理坐标（弧度）转经纬度坐标

                        var popupCartesian = Cesium.Cartesian3.fromDegrees(point[0], point[1], 0);
                        var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(cesium.cesiumViewer.scene, popupCartesian);
                        var obj = { position: position, content: content };
                        cesium.infoWindow(obj);
                        break;
                    }
                }
            }
        }

        /**
         *加载gltf信息列表
        */
        function loadGltfList() {
            var data = MapConfig.Obj3Djson;
            if (data && data.length > 0) {
                var innerStr = [];
                for (var i = 0; i < data.length; i++) {
                    //innerStr.push('<div class="left_list_li_box" id = "' + data[i].id + '" onclick="this.toLocationGltf(\'' + data[i].id + '\')">');
                    innerStr.push('<div class="left_list_li_box" id = "' + data[i].id + '">');
                    innerStr.push('<div class="left_list_li_box_top">');
                    innerStr.push('<div class="left2_box2">');
                    innerStr.push('<img class="list_poi_marker" src="./gis/cesium/images/poiLocation.png"></img>');
                    innerStr.push('<div class="left_list_li1">');
                    innerStr.push('<p>');
                    innerStr.push('<a>id:' + data[i].id + '</a><br/>');
                    innerStr.push('<a>名称:' + data[i].name + '</a><br/>');
                    innerStr.push('<a>地址:' + data[i].address + '</a><br/>');
                    innerStr.push('</p>');
                    innerStr.push('</div>');
                    innerStr.push('</div>')
                    innerStr.push('</div>');
                    innerStr.push('</div>');
                }
                $("#showLists").html(innerStr.join(''));
                $(".left_list_li_box").click(function (e) {
                    //console.log("left_list_li_box",e.currentTarget.id);
                    var id = e.currentTarget.id;
                    toLocationGltf(id);
                });
                //滚动条样式
                $("#showLists").mCustomScrollbar({
                    theme: "minimal-dark",
                });
            }
        }
        loadGltfList();

        //倾斜摄影3DTiles
        $("#cesium3DTiles").click(function () {
            cesium.add3DTiles(MapConfig.Tiles3D);
        });
        //调用接口-批量加载图标显示
        var symbols = [];
        var obj = {
            id: "monitorID_1",
            name: "测试监控1",
            type: "infoWindow",
            position: Cesium.Cartesian3.fromDegrees(111.075, 21.468),
            url: GLOBAL.domainResource + "/gis/cesium/images/red.png",
            description: { name: "测试监控1", content: "测试在线监控气泡窗口内容1" },
            width: 32,
            height: 60
        };
        symbols.push(obj);
        cesium.addPictureMarkerSymbols(symbols);
        //动态添加气泡窗口DIV
        var infoDiv = '<div id="trackPopUp" style="display:none;">' +
            '<div id="trackPopUpContent" class="leaflet-popup" style="top:-25px;left:0px;">' +
            '<a class="leaflet-popup-close-button" href="#">×</a>' +
            '<div class="leaflet-popup-content-wrapper">' +
            '<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;"></div>' +
            '</div>' +
            '<div class="leaflet-popup-tip-container">' +
            '<div class="leaflet-popup-tip"></div>' +
            '</div>' +
            '</div>' +
            '</div>';
        //$("#"+cesium.mapDivId).append(infoDiv);
        $(".cesium-viewer").append(infoDiv);
        //调用接口-气泡窗口
        var handler3D = new Cesium.ScreenSpaceEventHandler(cesium.cesiumViewer.scene.canvas);
        handler3D.setInputAction(function (movement) {
            //点击弹出气泡窗口
            //console.log('movement.position',movement.position);
            var pick = cesium.cesiumViewer.scene.pick(movement.position);
            if (pick && pick.id && pick.id._position) {//选中某模型
                var cartographic = Cesium.Cartographic.fromCartesian(pick.id._position._value);//世界坐标转地理坐标（弧度）
                //var point=[ cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];//地理坐标（弧度）转经纬度坐标
                var point = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];//地理坐标（弧度）转经纬度坐标
                var destination = Cesium.Cartesian3.fromDegrees(point[0], point[1], 3000.0);
                //debugger;
                //判断是否弹出气泡窗口内容
                switch (pick.id._type) {
                    case "infoWindow":
                        var content =
                            "<div>" +
                            "<span>测试监控1:</span><span>测试监控11</span></br>" +
                            "<span>测试监控12:</span><span>测试监控12</span></br>" +
                            "<span>测试监控13:</span><span>测试监控13</span></br>" +
                            "</div>";
                        var obj = { position: movement.position, destination: destination, content: content };
                        cesium.infoWindow(obj);
                        break;
                    case "gltf":
                        for (var i = 0; i < MapConfig.Obj3Djson.length; i++) {
                            var data = MapConfig.Obj3Djson[i];
                            if (pick.id._id == data.id) {
                                var content =
                                    "<div>" +
                                    "<span>名称:</span><span>" + data.name + "</span></br>" +
                                    "<span>地址:</span><span>" + data.address + "</span></br>" +
                                    "</div>";
                                var obj = { position: movement.position, destination: destination, content: content };
                                cesium.infoWindow(obj);
                                break;
                            }
                        }
                        //console.log(pick.id);
                        break;
                }
            }
            else {
                $('#trackPopUp').hide();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //飞行路径模块部分
        $("#cesiumFly3DPaths").click(function () {
            if ($(this).attr("class").indexOf("selected") != -1) {
                $(".fly3DPaths").show();
            } else {
                $(".fly3DPaths").hide();
            }
        });
        bxmap.FlyCesium.Init(cesium, drawHelper);//初始化漫游飞行路径功能

    }

    //URL及其他配置信息
    module.exports = {
        CESIUM: cesium,
        init: init
    };
});