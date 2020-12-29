//空间面积测量js
var MeasureSpaceArea = function (viewer, opt) {
	this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
	this.viewer = viewer;
	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

	//线
	this.polyline = null;
	//面
	this.polygon = null;
	//面积标签
	this.floatLabel = null;
	this.positions = [];
	this.movePush = false;
	this.prompt = new MovePrompt(viewer, {});
}
MeasureSpaceArea.prototype = {
	//开始测量
	start: function () {
		var that = this;
		this.handler.setInputAction(function (evt) {
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon,that.polyline]);
			if (!cartesian) return;
			if (that.movePush) {
				that.positions.pop();
				that.movePush = false;
			}
			that.positions.push(cartesian);
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		this.handler.setInputAction(function (evt) {
			if (that.positions.length < 1) {
				that.prompt.updatePrompt(evt.endPosition, "单击开始绘制");
				return;
			}
			that.prompt.updatePrompt(evt.endPosition, "右键结束");
			var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polygon,that.polyline]);

			if (that.positions.length >= 2) {
				if (!that.movePush) {
					that.positions.push(cartesian);
					that.movePush = true;
				} else {
					that.positions[that.positions.length - 1] = cartesian;
				}
				if (that.positions.length == 2) {
					if (!Cesium.defined(that.polyline)) {
						that.polyline = that.createPolyline();
					}
				}
				if (that.positions.length == 3) {
					if (!Cesium.defined(that.polygon)) {
						that.polygon = that.createPolygon(that.style);
						that.polygon.isFilter = true;
						that.polygon.objId = that.objId;
					}
					if(!that.floatLabel) that.floatLabel = that.createLabel(cartesian, "");
				}
				if (that.polygon) {
					var area = that.getAreaAndCenter(that.positions).area;
					var center = that.getAreaAndCenter(that.positions).center;
					var text = that.formatArea(area);
					that.floatLabel.label.text = "面积：" + text;
					if (center) that.floatLabel.position.setValue(center);
				}
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.handler.setInputAction(function (evt) {
			if (!that.polygon) return;
			that.viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
			that.viewer.trackedEntity = undefined;
			if (!that.polygon) return;
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon,that.polyline]);
			that.positions.push(cartesian);
			if (that.polygon) {
				var area = that.getAreaAndCenter(that.positions).area;
				var center = that.getAreaAndCenter(that.positions).center;
				var text = that.formatArea(area);
				that.floatLabel.label.text = "面积：" + text;
				if (center) that.floatLabel.position.setValue(center);
			}
			that.handler.destroy();
			if (that.movePush) {
				that.positions.pop();
				that.movePush = false;
			}
			if (that.prompt) {
				that.prompt.destroy();
				that.prompt = null;
			}
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	},
	//清除测量结果
	clear: function () {
		if (this.polyline) {
			this.viewer.entities.remove(this.polyline);
			this.polyline = null;
		}
		if (this.polygon) {
			this.viewer.entities.remove(this.polygon);
			this.polygon = null;
		}
		if (this.floatLabel) {
			this.viewer.entities.remove(this.floatLabel);
			this.floatLabel = null;
		}
		this.floatLable = null;
	},
	createPolyline: function () {
		var that = this;
		var polyline = this.viewer.entities.add({
			polyline: {
				positions: new Cesium.CallbackProperty(function () {
					return that.positions
				}, false),
				show: true,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				material: Cesium.Color.YELLOW,
				width: 3
			}
		});
		return polyline;
	},
	createPolygon: function () {
		var that = this;
		var polygon = this.viewer.entities.add({
			polygon: new Cesium.PolygonGraphics({
				hierarchy: new Cesium.CallbackProperty(function () {
					return new Cesium.PolygonHierarchy(that.positions);
				}, false),
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				material: Cesium.Color.YELLOW,
				show: true,
				fill: true
			})
		});
		return polygon;
	},
	createLabel: function (c, text) {
		if (!c) return;
		var label = this.viewer.entities.add({
			position: c,
			label: {
				text: text || "",
				font: '24px Helvetica',
				fillColor: Cesium.Color.SKYBLUE,
				outlineColor: Cesium.Color.BLACK,
				outlineWidth: 2,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			}
		});
		return label;
	},
	//调用第三方插件计算面积 turf
	getAreaAndCenter: function (positions) {
		if (!positions || positions.length < 1) return;
		var cartographics = [];
		var turfPoints = [];
		for (var i = 0; i < positions.length; i++) {
			var cartesian3 = positions[i];
			var cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
			cartographics.push([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)]);
			turfPoints.push(turf.point([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)]));
		}
		if (!cartographics.length) return;
		cartographics = cartographics.concat([cartographics[0]]);
		var polygon = turf.polygon([cartographics]);
		var area = turf.area(polygon);

		//获取当前范围的中心点
		var features = turf.featureCollection(turfPoints);
		var turfCenter = turf.center(features);
		var center = turfCenter.geometry.coordinates;

		return {
			area: area,
			center: Cesium.Cartesian3.fromDegrees(center[0], center[1])
		};
	},
	formatArea: function (num, dw) {
		if (!num) return;
		var res = null;
		if (!dw) {
			dw = "平方米";
			var n = Number(num).toFixed(2);
			res = n + dw;
		}
		if (dw == "平方千米" || dw == "平方公里") {
			var n = (Number(num) / 1000000).toFixed(2);
			res = n + dw;
		}
		return res;
	},
	//兼容模型和地形上坐标拾取
	getCatesian3FromPX: function (px, viewer, entitys) {
		var picks = viewer.scene.drillPick(px);
		this.viewer.scene.render();
		var cartesian;
		var isOn3dtiles = false;
		for (var i = 0; i < picks.length; i++) {
			var isContinue = false;
			for (var step = 0; step < entitys.length; step++) {
				if (entitys[step] && picks[i].id && entitys[step].objId == picks[i].id.objId) {
					isContinue = true;
					break;
				}
			}
			if (isContinue) continue;
			if ((picks[i] && picks[i].primitive) || picks[i] instanceof Cesium.Cesium3DTileFeature) { //模型上拾取
				isOn3dtiles = true;
			}
		}
		if (isOn3dtiles) {
			cartesian = viewer.scene.pickPosition(px);
		} else {
			var ray = viewer.camera.getPickRay(px);
			if (!ray) return null;
			cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		}
		return cartesian;
	}
}