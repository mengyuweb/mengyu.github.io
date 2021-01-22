import * as THREE from './lib/three.module.js';
import {
	OrbitControls
} from './lib/OrbitControls.js';
import {
	CSS2DRenderer,
	CSS2DObject
} from './lib/CSS2DRenderer.js';
import {
	datas
} from "./data.js";
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var renderer,
    scene,
    camera,
    controls,
    material,
    raycaster,
    planeMesh = [],
    arrMaterial = [],
    arrMaterial1 = {},
    arrMaterial2 = {},
    index = -1,
    imgIndex = 0,
    oldIndex = -1,
    allImgActive = false,
    imgIdName = "img",
    indexImgValue = 1,
    indexImgKey = 1,
    moon,
    labelRenderer,
    INTERSECTED;
var _datas = datas,
    bjPosition = _datas.bjPosition,
    bjBox = _datas.bjBox,
    imgList = _datas.imgList,
    boxColor = _datas.boxColor,
    imgInit = _datas.imgInit,
    imgColor = _datas.imgColor,
    imgActiveColor = _datas.imgActiveColor,
    groupSlateX = _datas.groupSlateX,
    groupSlateY = _datas.groupSlateY,
    bottonList = _datas.bottonList,
    lamp = _datas.lamp,
    imgListLength = _datas.imgListLength,
    mouseColor = _datas.mouseColor,
    mouseOpacity = _datas.mouseOpacity,
    lightTop = _datas.lightTop,
    lightLeft = _datas.lightLeft,
    lightScale = _datas.lightScale;
var mouse = new THREE.Vector2();
var group = new THREE.Group();
init();

function init() {
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 3);
  scene = new THREE.Scene(); //聚光灯

  var _iterator = _createForOfIteratorHelper(lamp),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _k = _step.value;
      fnLamp(_k.position);
    } // 墙面

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var texture = new THREE.TextureLoader().load("img/bj.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 1); //平铺

  var bjmaterial = new THREE.MeshBasicMaterial({
    map: texture
  });
  var bjMesh = new THREE.Mesh(new THREE.PlaneGeometry(35, 4), bjmaterial); //大小

  bjMesh.position.set(bjPosition[0], bjPosition[1], bjPosition[2]);
  scene.add(bjMesh); //图片

  for (var k in imgList) {
    for (var i in imgList[k]) {
      fnImg(imgList[k][i], i, k);
    }
  } //平铺 MeshBasicMaterial变成MeshPhongMaterial 


  material = new THREE.MeshPhongMaterial({
    color: boxColor
  });

  var _iterator2 = _createForOfIteratorHelper(bjBox),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _k2 = _step2.value;
      fnBox(_k2);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  scene.translateX(groupSlateX);
  scene.translateY(groupSlateY);
  scene.add(group);
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.id = 'labelRenderer';
  labelRenderer.domElement.style.top = '0px';
  document.body.appendChild(labelRenderer.domElement);
  controls = new OrbitControls(camera, labelRenderer.domElement);
  controls.enableRotate = false; //false

  controls.screenSpacePanning = true; //相机移动最小和最大范围

  controls.minDistance = 2.5;
  controls.maxDistance = 3.5; //阻尼

  controls.enableDamping = true;
  controls.dampingFactor = 0.5; //是否开启右键拖拽

  controls.enablePan = true; //行动范围

  controls.rangeBox = new THREE.Box3(new THREE.Vector3(-0.2, -0.3, -Infinity), new THREE.Vector3(25, 0.3, +Infinity)); //鼠标按钮

  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  };
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  raycaster = new THREE.Raycaster();
  fnAll();
  animate();
  window.addEventListener('resize', onWindowResize, false);
}

function fnLamp(p) {
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(p[0], p[1], p[2]);
  spotLight.angle = Math.PI / 1; //光线散射角度(锥形的顶角视宽)，最大Math.PI/2.默认Math.PI/3

  spotLight.penumbra = 0.1; //光锥中心向边缘递减的过程

  spotLight.decay = 1; //衰减光的强度

  spotLight.distance = 4; //距离灯光的最远距离

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  var labelHtmlId = fnId("labelRenderer");

  if (labelHtmlId) {
    document.body.removeChild(labelHtmlId);

    for (var i in planeMesh) {
      var _planeMesh$i = planeMesh[i],
          uuid = _planeMesh$i.uuid,
          userData = _planeMesh$i.userData;
      fn2d(planeMesh[i], userData.title, userData.imgwh2, uuid);
    }

    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.id = 'labelRenderer';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);
  }
}

function fnBox(o) {
  var boxGeometry = o.geometry;
  var position = o.position;
  var geometry = new THREE.BoxGeometry(boxGeometry[0], boxGeometry[1], boxGeometry[2]);
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(position[0], position[1], position[2]);
  cube.translateX(boxGeometry[0] / 2);
  cube.translateY(-+boxGeometry[1] / 2);
  cube.castShadow = true;
  scene.add(cube);
}

function fnImg(img, i, k) {
  var imgwh = img.imgwh,
      imgurl = img.imgurl,
      imgp = img.imgp,
      title = img.title;

  if (i == 0) {
    imgIndex = 0;
  }

  if (imgp[0] == 0) {
    imgIndex += 1;
  } else {
    imgIndex += imgp[0];
  }

  var imgGeometry = new THREE.PlaneGeometry(imgwh[0], imgwh[1]);
  var imgMaterial = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('img/list/' + imgurl + '.png'),
    transparent: true,
    opacity: 1,
    color: imgColor
  });
  var imgGeometry2 = new THREE.PlaneGeometry(2, 3.5);
  var imgMaterial2 = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('img/guang.png'),
    transparent: true,
    opacity: 0
  });
  var plane = new THREE.Mesh(imgGeometry, imgMaterial);
  var plane2 = new THREE.Mesh(imgGeometry2, imgMaterial2);
  var imgwh2 = imgwh[1] / 2;
  var id = imgIdName + imgurl;
  plane.position.set(imgIndex, imgp[1], imgp[2]);
  plane2.position.x = imgIndex;

  if (k == 1) {
    plane2.position.y = datas.lightY1;
  } else if (k == 2) {
    plane2.position.y = datas.lightY2;
  } else {
    plane2.position.y = datas.lightY3;
  }

  plane2.position.z = imgp[2];
  plane.uuid = id;
  plane.name = "oImg";
  plane.userData["title"] = title;
  plane.userData["imgwh2"] = imgwh2;
  plane.translateX(-+imgwh2);
  plane.translateY(imgwh2);
  plane2.translateX(-+imgwh2);
  plane2.translateY(datas.lightY);
  group.add(plane);
  scene.add(plane2);
  planeMesh.push(plane);
  arrMaterial.push(imgMaterial);
  arrMaterial1[imgurl] = imgMaterial;
  arrMaterial2[imgurl] = imgMaterial2;
  fn2d(plane, title, imgwh2, id, k);
}

function fn2d(plane) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "暂无数据";
  var imgwh2 = arguments.length > 2 ? arguments[2] : undefined;
  var id = arguments.length > 3 ? arguments[3] : undefined;
  var k = arguments.length > 4 ? arguments[4] : undefined;

  if (indexImgValue == k) {
    if (indexImgValue != 1) {
      indexImgKey -= lightScale;
    }

    indexImgValue += 1;
  }

  var moonDiv = document.createElement('div');
  moonDiv.className = 'label2D';
  moonDiv.id = id;
  moonDiv.innerHTML = '<div class="labelFled"><div class="labelTitle"><span>' + title + '</span></div></div>';
  var moonLabel = new CSS2DObject(moonDiv);
  moonLabel.position.set(0, imgwh2, 0);
  plane.add(moonLabel);
}

function fnId(id) {
  return document.getElementById(id);
}

function fnActive(uuid) {
  oldIndex = index;

  if (allImgActive) {
    fnImgAll(imgColor, 0, false);
  }

  for (var k in arrMaterial) {
    if (arrMaterial[k].uuid == uuid) {
      index = k;
      break;
      return false;
    }
  }

  if (oldIndex == index) {
    if (planeMesh[index].userData["isAcrive"]) {
      fnActiveColor(imgColor, 0, false);
    } else {
      fnActiveColor(imgActiveColor, 1, true);
    }
  } else {
    if (oldIndex != -1) {
      fnActiveColor(imgColor, 0, false, oldIndex);
    }

    fnActiveColor(imgActiveColor, 1, true);
  }
}

function fnActiveColor(color, z, isAcrive) {
  var k = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : index;
  arrMaterial[k].color.set(color);
  planeMesh[k].userData["isAcrive"] = isAcrive;
}

function fnImgAll(color, z, isAcrive) {
  for (var k in arrMaterial) {
    fnActiveColor(color, z, isAcrive, k);
  }
}

function fnAll() {
  new Vue({
    el: "#app",
    data: {
      bottonList: bottonList,
      lightBulbBut: false,
      bottonLiIndex: -1,
      arrowLeft: 0,
      arrowRight: 0,
      modals: false,
      alerts: "",
      mousex: 0,
      mousey: 0,
      slidervalue: 0,
      newIndex: -1,
      sliderstep: (100 / imgList[imgListLength].length).toFixed(1)
    },
    mounted: function mounted() {
      document.getElementById("app").classList.remove("hide");
      document.addEventListener('mousemove', this.onDocumentMouseMove, false);
      var self = this;

      document.onclick = function (event) {
        event.stopPropagation();

        if (!self.modals) {
          self.mousex = event.clientX / window.innerWidth * 2 - 1;
          self.mousey = -(event.clientY / window.innerHeight) * 2 + 1;
          self.fnDocumentMouseMove("click");
        }
      };
    },
    methods: {
      fnModals: function fnModals(id) {
        var oHtml = id + "<p>弹框content</p>";
        return oHtml;
      },
      lightBulb: function lightBulb() {
        this.lightBulbBut = !this.lightBulbBut;

        if (this.lightBulbBut) {
          fnImgAll(imgActiveColor, 1, true);
          allImgActive = true;
        } else {
          allImgActive = false;
          fnImgAll(imgColor, 0, false);
        }
      },
      bottonLi: function bottonLi(index) {
        this.gotoImg(this.bottonList[index].id);
        this.arrowLeft = 0;
        this.arrowRight = 0;
        this.bottonLiIndex = index;
      },
      arrow: function arrow(index) {
        var bottonLiIndex = this.bottonLiIndex;
        var bottonList = this.bottonList;

        if (index == 1 && bottonLiIndex != bottonList.length - 1) {
          this.arrowLeft = 0;
          this.arrowRight = 1;
          this.bottonLiIndex = bottonLiIndex += 1;
        } else if (index == -1 && bottonLiIndex) {
          if (bottonLiIndex == -1) {
            return false;
          }

          this.arrowLeft = 1;
          this.arrowRight = 0;
          this.bottonLiIndex = bottonLiIndex -= 1;
        } else {
          return false;
        }

        this.gotoImg(bottonList[bottonLiIndex].id);
      },
      gotoImg: function gotoImg(uuid, n) {
        var index = this.bottonLiIndex;
        this.slidervalue = uuid * this.sliderstep;
        var oid = n ? uuid : imgIdName + uuid;

        for (var k in planeMesh) {
          if (planeMesh[k].uuid == oid) {
            index = k;
            break;
          }
        }

        if (index >= 0) {
          var position = planeMesh[index].getWorldPosition(new THREE.Vector3());
          var tween = new TWEEN.Tween(camera.position);
          tween.to({
            x: position.x
          }, 500).onUpdate(function () {
            controls.target = new THREE.Vector3().copy(camera.position).setZ(0);
            controls.update();
          });
          tween.start();
        }
      },
      onDocumentMouseMove: function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = event.clientX / window.innerWidth * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.fnDocumentMouseMove();
      },
      fnDocumentMouseMove: function fnDocumentMouseMove(on) {
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(group.children);

        if (this.newIndex != -1) {
          this.fnMouseActive(imgColor, 1, 0);

          if (allImgActive) {
            fnImgAll(imgActiveColor, 1, true);
          }

          this.newIndex = -1;
        }

        if (!intersects[0]) {
          if (INTERSECTED) fnId(INTERSECTED).classList.remove("show");
          return false;
        }

        var _intersects$0$object = intersects[0].object,
            uuid = _intersects$0$object.uuid,
            name = _intersects$0$object.name;

        if (!name) {
          return false;
        }

        if (on && mouse.x - this.mousex == 0) {
          this.alerts = this.fnModals(uuid);
          this.modals = true;
          this.gotoImg(uuid, 1);
          return false;
        }

        if (INTERSECTED && INTERSECTED != uuid) {
          fnId(INTERSECTED).classList.remove("show");
        }

        INTERSECTED = uuid;
        var imgIndex = uuid.split(imgIdName)[1];
        var idIndex = imgIndex - 1;
        this.newIndex = idIndex;
        this.fnMouseActive(mouseColor, mouseOpacity, 1);
        fnId(uuid).classList.add("show");
        renderer.render(scene, camera);
      },
      fnMouseActive: function fnMouseActive(mouseColor, mouseOpacity, n) {
        if (arrMaterial2[this.newIndex]) {
          arrMaterial1[this.newIndex + 1].color.set(imgColor);
          arrMaterial2[this.newIndex + 1].opacity = n;
        }
      },
      modalsClose: function modalsClose() {
        this.modals = false;
        this.alerts = "";
      },
      fnSlider: function fnSlider(i) {
        if (this.bottonLiIndex != -1) this.bottonLiIndex = -1;
        this.gotoImg(parseInt(i / this.sliderstep));
      }
    }
  });
}