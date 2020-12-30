//空间距离量算js
var MeasureSpaceDistance = function (viewer, opt) {
	this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
	this.viewer = viewer;
	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	//线
	this.polyline = null;
	//线坐标
	this.positions = [];
	//标签数组
	this.labels = [];
	this.floatLable = null;
	this.lastCartesian = null;
	this.allDistance = 0;
	this.movePush = false;
	this.prompt = new MovePrompt(viewer, {});
}
MeasureSpaceDistance.prototype = {
	//开始测量
	start: function () {
		var that = this;
		this.handler.setInputAction(function (evt) { //单击开始绘制
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline, that.floatLable]);
			if (!cartesian) return;
			//that.tsLabel.label.text = "单击新增点\n双击结束";
			var label;
			if (that.positions.length == 0) {
				label = that.createLabel(cartesian, "起点");
				that.floatLable = that.createLabel(cartesian, "");
				that.floatLable.show = false;
				if (that.movePush) {
					that.positions.pop();
					that.movePush = false;
				}
			} else {
				var distance = that.getLength(cartesian, that.lastCartesian);
				that.allDistance += distance;
				var text = that.formatLength(distance);
				label = that.createLabel(cartesian, text);
			}
			that.labels.push(label);
			that.positions.push(cartesian);
			that.lastCartesian = cartesian;
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		this.handler.setInputAction(function (evt) {
			if (that.positions.length < 1) {
				that.prompt.updatePrompt(evt.endPosition, "单击开始测量");
				return;
			} else {
				that.prompt.updatePrompt(evt.endPosition, "右键结束");
				that.floatLable.show = true;
				var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polyline, that.floatLable]);
				if (!cartesian) return;
				if (!that.movePush) {
					that.positions.push(cartesian);
					that.movePush = true;
				} else {
					that.positions[that.positions.length - 1] = cartesian;
				}

				if (!Cesium.defined(that.polyline)) {
					that.polyline = that.createLine();
				}
				if (!that.lastCartesian) return;
				var distance = that.getLength(cartesian, that.lastCartesian);
				that.floatLable.show = true;
				that.floatLable.label.text = that.formatLength(distance);
				that.floatLable.position.setValue(cartesian);
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.handler.setInputAction(function (evt) {
			if (!that.polyline) return;
			that.floatLable.show = false;

			if (that.movePush) {
				that.positions.pop();
				that.movePush = false;
			}
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline, that.floatLable]);
			if (!cartesian) return;
			that.positions.push(cartesian);
			var distance = that.getLength(cartesian, that.lastCartesian);
			that.allDistance += distance;
			var text = that.formatLength(distance);
			var label = that.createLabel(cartesian, text);
			that.labels.push(label);
			that.viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
			that.viewer.trackedEntity = undefined;

			var allDistance = that.formatLength(that.allDistance);
			that.labels[that.labels.length - 1].label.text = "总长：" + allDistance;
			if (that.handler) {
				that.handler.destroy();
				that.handler = null;
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
		for (var i = 0; i < this.labels.length; i++) {
			this.viewer.entities.remove(this.labels[i]);
		}
		this.labels = [];
		if (this.floatLable) {
			this.viewer.entities.remove(this.floatLable);
			this.floatLable = null;
		}
		if (this.prompt) {
			this.prompt.destroy();
			this.prompt = null;
		}
		this.viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
		this.viewer.trackedEntity = undefined;
	},
	createLine: function () {
		var that = this;
		var polyline = this.viewer.entities.add({
			polyline: {
				positions: new Cesium.CallbackProperty(function () {
					return that.positions
				}, false),
				show: true,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				material: Cesium.Color.YELLOW,
				Width: 3
			}
		});
		polyline.objId = this.objId;
		return polyline;
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
				horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			}
		});

		return label;
	},
	getLength: function (c1, c2) {
		if (!c1 || !c2) return 0;
		return Cesium.Cartesian3.distance(c1, c2);
	},
	formatLength: function (num, dw) {
		if (!num) return;
		var res = null;
		if (!dw) {
			dw = "米";
			var n = Number(num).toFixed(2);
			res = n + dw;
		}
		if (dw == "千米" || dw == "公里") {
			var n = (Number(num) / 1000).toFixed(2);
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