/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.core.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader.js */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
//23FI091　最終課題:『教室からの脱出』



 //最後にこれを追加してcanon-esが使えるようになります。
class ThreeJSContainer {
    scene;
    light;
    world;
    camera; // ← 追加
    clickableObjects = [];
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__.OrbitControls(this.camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, -9.82, 0) }); //この重力加速度をもつworldを作成。
        this.world.defaultContactMaterial.friction = 0.3; //摩擦係数や
        this.world.defaultContactMaterial.restitution = 0.0; //反発係数も設定可能。
        //場面の管理。新たに場面に名前をつけるときはphaseに追加。
        const phase = {
            OPENING: 0,
            TITLE: 1,
            PCOPENED: 2,
            SAFEOPENED: 3,
            ENDING: 4
        };
        let count = 0;
        for (const key in phase) {
            phase[key] = count;
            count++;
        }
        //console.log(phase["ENDING"]);
        const classroom = new Classroom(6, 9);
        this.scene.add(classroom.room);
        const distance = 0.5;
        const loader = new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_4__.GLTFLoader();
        let chairIndex = 0;
        let deskIndex = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                if (i < 5 || j == 0) {
                    loader.load('school_chair.glb', (gltf) => {
                        const model = gltf.scene;
                        model.position.set(-0.884 - 2 * distance + (0.442 + distance) * j, 0, -0.85 - 2 * distance + (0.425 + distance) * i);
                        model.scale.set(1, 1, 1);
                        model.rotateY(Math.PI / 2);
                        model.traverse((child) => {
                            if (child.isMesh) {
                                child.userData.label = `chair${chairIndex}`; // `deskIndex` のときも同様
                                this.clickableObjects.push(child); // Mesh単体を登録
                            }
                        });
                        chairIndex++;
                        this.scene.add(model);
                        //this.clickableObjects.push(model);
                    });
                    loader.load('school_desk.glb', (gltf) => {
                        const model = gltf.scene;
                        model.position.set(-0.884 - 2 * distance + (0.442 + distance) * j, 0, -1.35 - 2 * distance + (0.425 + distance) * i);
                        model.scale.set(1, 1, 1);
                        model.rotateY(Math.PI / 2);
                        // 椅子と机の読み込み部分でこのように修正m
                        model.traverse((child) => {
                            if (child.isMesh) {
                                child.userData.label = `desk${deskIndex}`; // `deskIndex` のときも同様
                                this.clickableObjects.push(child); // Mesh単体を登録
                            }
                        });
                        deskIndex++;
                        this.scene.add(model);
                        //this.clickableObjects.push(model);
                    });
                }
            }
        }
        const cubeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0.5, 0.5, 0.5)); //CANNON.Boxのサイズはcubeの半分！！
        const cubeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 1 }); //重さを設定します。単位はkg。
        loader.load('sakasama_woman.glb', (gltf) => {
            const model = gltf.scene;
            model.name = "woman";
            model.position.set(-5, 10, -1.5);
            model.scale.set(1, 1, 1);
            this.scene.add(model);
            //このcubeにcanonを追加するには、canonの世界用の物体を用意します。
            cubeBody.addShape(cubeShape);
            cubeBody.position.set(model.position.x, model.position.y, model.position.z); //最後に位置の状態と
            cubeBody.quaternion.set(model.quaternion.x, model.quaternion.y, model.quaternion.z, model.quaternion.w); //回転の状態をcubeからコピー
            this.world.addBody(cubeBody);
        });
        //地面の作成
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial();
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(6, 9);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide; // 両面
        planeMesh.position.y = 2;
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(3, 0.5, 4.5));
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 0 }); //重さを0にすると重力の影響を受けない物体を作ることができる！！！！！
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y - 1, planeMesh.position.z);
        //planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        this.world.addBody(planeBody);
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(10);
        this.scene.add(gridHelper);
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(5);
        this.scene.add(axesHelper);
        //2.AmbientLight
        let light = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 1.0); //(ライトの色,ライトの強さ)
        light.position.set(1, 1, 1); //ライトの位置
        //シーン全体に適用されるライトのため、方向とかはない。影も落ちない。
        this.scene.add(light);
        let wisPressed = false;
        let aisPressed = false;
        let sisPressed = false;
        let disPressed = false;
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'W':
                    wisPressed = true;
                    break;
                case 'a':
                    aisPressed = true;
                    break;
                case 's':
                    sisPressed = true;
                    break;
                case 'd':
                    disPressed = true;
                    break;
            }
        });
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'W':
                    wisPressed = false;
                    break;
                case 'a':
                    aisPressed = false;
                    break;
                case 's':
                    sisPressed = false;
                    break;
                case 'd':
                    disPressed = false;
                    break;
            }
        });
        //クリックされたことを検知するためには、raycasterで光線を出す必要がある？？？(よくわからないし動かない)
        const raycaster = new three__WEBPACK_IMPORTED_MODULE_1__.Raycaster();
        const mouse = new three__WEBPACK_IMPORTED_MODULE_1__.Vector2();
        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.clickableObjects, true);
            for (let i = 0; i < intersects.length; i++) {
                const obj = intersects[i].object;
                // GridHelperやAxesHelperなどを除外
                if (obj instanceof three__WEBPACK_IMPORTED_MODULE_1__.GridHelper || obj instanceof three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper)
                    continue;
                // labelがあるオブジェクトのみ表示
                if (obj.userData && obj.userData.label) {
                    console.log("クリックされたオブジェクト:", obj.userData.label);
                }
                else {
                    console.log("クリックされたがラベルなし:", obj.name || obj.type);
                }
                break; // 最初に当たった1つだけ処理
            }
        });
        let update = (time) => {
            requestAnimationFrame(update);
            this.world.fixedStep(); //update関数では、これでworldの物理演算を実行します。
            const woman = this.scene.getObjectByName("woman");
            if (woman) {
                woman.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z); //最後に位置の状態と
                woman.quaternion.set(cubeBody.quaternion.x, cubeBody.quaternion.y, cubeBody.quaternion.z, cubeBody.quaternion.w); //回転の状態をcubeからコピー
            }
            if (woman.position.y < -50) {
                cubeBody.position.set(0, 5, -1.5);
                setTimeout(() => {
                    //console.log("3秒経過しました");
                    cubeBody.position.set(-5, 10, -1.5);
                }, 30000);
            }
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(2, 1.6, 2));
    document.body.appendChild(viewport);
}
class Classroom {
    room;
    constructor(width, height) {
        this.room = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
        //地面の作成
        const tileWidth = 1;
        const tileHeight = 1;
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(tileWidth, tileHeight);
        const textureLoader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();
        const texture = textureLoader.load('floor.png');
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: texture }); //こっちを使うとインポートした画像を使ったマテリアルを生成できます。
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const tile = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
                tile.rotateX(-Math.PI / 2);
                tile.position.set(-width / 2 + tileWidth / 2 + tileWidth * j, 0, -height / 2 + tileHeight / 2 + tileHeight * i);
                //tiles.push(tile);  
                this.room.add(tile);
            }
        }
        //壁の作成
        const gtfLoader = new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_4__.GLTFLoader();
        gtfLoader.load('classroom_wall.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_leftWindow.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_rightWindow.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_frontDoor.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_backDoor.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_ceiling.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('blackboard_center.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('blackboard_right.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('blackboard_back.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-0.15, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('curtain_closed.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-0.75, 0.20, -0.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('curtain_opened.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1, 0.25, -1.75);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('blue_book.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('red_book.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('cleaningLocker_opened.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(2.4, 0, 4.2);
            model.scale.set(0.3 * width / 6, 0.3 * width / 6, 0.3 * width / 6);
            model.rotateY(-Math.PI);
            this.room.add(model);
        });
        gtfLoader.load('houki.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(1.8, 0, 2.0);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('locker.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1.0, 0, -1.5);
            model.scale.set(0.20 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('woman.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(1, 0.1, 2.5);
            model.scale.set(1 * width / 6, 1 * width / 6, 1 * width / 6);
            model.rotateZ(Math.PI / 2);
            this.room.add(model);
        });
        /*
        this.loadModel('bookshelf.glb',  { x: -0.5, y: 0, z: 0 }, 1);
        this.loadModel('blue_book.glb',  { x: -10, y: -5, z: 0 }, 1);
        this.loadModel('diyal.glb',  { x: 2, y: 0, z: 0 }, 1);
        this.loadModel('safe.glb',  { x: -0, y: 0, z: 0 }, 1);
        this.loadModel('safe_opened.glb',  { x: -2, y: -5, z: 0 }, 1);
        this.loadModel('woman.glb',  { x: 0, y: 0, z: 0 }, 1);
        this.loadModel('sakasama_woman.glb',  { x: 0, y: 0, z: 0 }, 1);*/
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_build_three_module_js-nod-11b64c"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLzIzRkkwOTHjgIDmnIDntYLoqrLpoYw644CO5pWZ5a6k44GL44KJ44Gu6ISx5Ye644CPXG5cbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanMnO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7Ly/mnIDlvozjgavjgZPjgozjgpLov73liqDjgZfjgaZjYW5vbi1lc+OBjOS9v+OBiOOCi+OCiOOBhuOBq+OBquOCiuOBvuOBmeOAglxuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIHdvcmxkOkNBTk5PTi5Xb3JsZDtcblxuICAgIHByaXZhdGUgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTsgLy8g4oaQIOi/veWKoFxuICAgIHByaXZhdGUgY2xpY2thYmxlT2JqZWN0czogVEhSRUUuT2JqZWN0M0RbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBcbiAgICB9XG5cbiAgICAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKSpcbiAgICBwdWJsaWMgY3JlYXRlUmVuZGVyZXJET00gPSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGNhbWVyYVBvczogVEhSRUUuVmVjdG9yMykgPT4ge1xuICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NDk1ZWQpKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlOyAvL+OCt+ODo+ODieOCpuODnuODg+ODl+OCkuacieWKueOBq+OBmeOCi1xuXG4gICAgICAgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuICAgICAgICB0aGlzLmNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyh0aGlzLmNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIxyZW5kZXJcbiAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGNvbnN0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8g44K344O844Oz44Gu5L2c5oiQKOWFqOS9k+OBpzHlm54pXG5cbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIHRoaXMud29ybGQ9IG5ldyBDQU5OT04uV29ybGQoeyBncmF2aXR5OiBuZXcgQ0FOTk9OLlZlYzMoMCwgLTkuODIsIDApfSk7Ly/jgZPjga7ph43lipvliqDpgJ/luqbjgpLjgoLjgaR3b3JsZOOCkuS9nOaIkOOAglxuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb24gPSAwLjM7Ly/mkanmk6bkv4LmlbDjgoRcbiAgICAgICAgdGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC4wOy8v5Y+N55m65L+C5pWw44KC6Kit5a6a5Y+v6IO944CCXG5cblxuICAgICAgICAvL+WgtOmdouOBrueuoeeQhuOAguaWsOOBn+OBq+WgtOmdouOBq+WQjeWJjeOCkuOBpOOBkeOCi+OBqOOBjeOBr3BoYXNl44Gr6L+95Yqg44CCXG4gICAgICAgIGNvbnN0IHBoYXNlPXtcbiAgICAgICAgICAgIE9QRU5JTkc6MCxcbiAgICAgICAgICAgIFRJVExFOjEsXG4gICAgICAgICAgICBQQ09QRU5FRDoyLFxuICAgICAgICAgICAgU0FGRU9QRU5FRDozLFxuICAgICAgICAgICAgRU5ESU5HOjRcbiAgICAgICAgfVxuICAgICAgICBsZXQgY291bnQ9MDtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcGhhc2UpIHtcbiAgICAgICAgICAgIHBoYXNlW2tleV09Y291bnQ7XG4gICAgICAgICAgICBjb3VudCsrOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIC8vY29uc29sZS5sb2cocGhhc2VbXCJFTkRJTkdcIl0pO1xuXG4gICAgICAgIGNvbnN0IGNsYXNzcm9vbT1uZXcgQ2xhc3Nyb29tKDYsOSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGNsYXNzcm9vbS5yb29tKTtcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgZGlzdGFuY2U9MC41O1xuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgR0xURkxvYWRlcigpO1xuICAgICAgICBsZXQgY2hhaXJJbmRleCA9IDA7XG4gICAgICAgIGxldCBkZXNrSW5kZXggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA1OyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDUgfHwgaiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRlci5sb2FkKCdzY2hvb2xfY2hhaXIuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMC44ODQgLSAyICogZGlzdGFuY2UgKyAoMC40NDIgKyBkaXN0YW5jZSkgKiBqLCAwLCAtMC44NSAtIDIgKiBkaXN0YW5jZSArICgwLjQyNSArIGRpc3RhbmNlKSAqIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDEsIDEsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwucm90YXRlWShNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC50cmF2ZXJzZSgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGNoaWxkIGFzIFRIUkVFLk1lc2gpLmlzTWVzaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC51c2VyRGF0YS5sYWJlbCA9IGBjaGFpciR7Y2hhaXJJbmRleH1gOyAvLyBgZGVza0luZGV4YCDjga7jgajjgY3jgoLlkIzmp5hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlja2FibGVPYmplY3RzLnB1c2goY2hpbGQpOyAvLyBNZXNo5Y2Y5L2T44KS55m76YyyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpckluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMuY2xpY2thYmxlT2JqZWN0cy5wdXNoKG1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBsb2FkZXIubG9hZCgnc2Nob29sX2Rlc2suZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMC44ODQgLSAyICogZGlzdGFuY2UgKyAoMC40NDIgKyBkaXN0YW5jZSkgKiBqLCAwLCAtMS4zNSAtIDIgKiBkaXN0YW5jZSArICgwLjQyNSArIGRpc3RhbmNlKSAqIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDEsIDEsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwucm90YXRlWShNYXRoLlBJIC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmpIXlrZDjgajmnLrjga7oqq3jgb/ovrzjgb/pg6jliIbjgafjgZPjga7jgojjgYbjgavkv67mraNtXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC50cmF2ZXJzZSgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGNoaWxkIGFzIFRIUkVFLk1lc2gpLmlzTWVzaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC51c2VyRGF0YS5sYWJlbCA9IGBkZXNrJHtkZXNrSW5kZXh9YDsgLy8gYGRlc2tJbmRleGAg44Gu44Go44GN44KC5ZCM5qeYXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpY2thYmxlT2JqZWN0cy5wdXNoKGNoaWxkKTsgLy8gTWVzaOWNmOS9k+OCkueZu+mMslxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVza0luZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMuY2xpY2thYmxlT2JqZWN0cy5wdXNoKG1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3ViZVNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDAuNSwgMC41LCAwLjUpKTsvL0NBTk5PTi5Cb3jjga7jgrXjgqTjgrrjga9jdWJl44Gu5Y2K5YiG77yB77yBXG4gICAgICAgIGNvbnN0IGN1YmVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMSB9KTsvL+mHjeOBleOCkuioreWumuOBl+OBvuOBmeOAguWNmOS9jeOBr2tn44CCXG4gICAgICAgIGxvYWRlci5sb2FkKCdzYWthc2FtYV93b21hbi5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWw9Z2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLm5hbWU9XCJ3b21hblwiO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KC01LCAxMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMSwxLDEpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQobW9kZWwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL+OBk+OBrmN1YmXjgatjYW5vbuOCkui/veWKoOOBmeOCi+OBq+OBr+OAgWNhbm9u44Gu5LiW55WM55So44Gu54mp5L2T44KS55So5oSP44GX44G+44GZ44CCXG4gICAgICAgICAgICBjdWJlQm9keS5hZGRTaGFwZShjdWJlU2hhcGUpO1xuICAgICAgICAgICAgY3ViZUJvZHkucG9zaXRpb24uc2V0KG1vZGVsLnBvc2l0aW9uLngsIG1vZGVsLnBvc2l0aW9uLnksIG1vZGVsLnBvc2l0aW9uLnopOy8v5pyA5b6M44Gr5L2N572u44Gu54q25oWL44GoXG4gICAgICAgICAgICBjdWJlQm9keS5xdWF0ZXJuaW9uLnNldChtb2RlbC5xdWF0ZXJuaW9uLngsIG1vZGVsLnF1YXRlcm5pb24ueSwgbW9kZWwucXVhdGVybmlvbi56LCBtb2RlbC5xdWF0ZXJuaW9uLncpOy8v5Zue6Lui44Gu54q25oWL44KSY3ViZeOBi+OCieOCs+ODlOODvFxuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KGN1YmVCb2R5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8v5Zyw6Z2i44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IHBob25nTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoKTtcbiAgICAgICAgY29uc3QgcGxhbmVHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDYsOSk7XG4gICAgICAgIGNvbnN0IHBsYW5lTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHBsYW5lR2VvbWV0cnksIHBob25nTWF0ZXJpYWwpO1xuICAgICAgICBwbGFuZU1lc2gubWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkRvdWJsZVNpZGU7IC8vIOS4oemdolxuICAgICAgICBwbGFuZU1lc2gucG9zaXRpb24ueT0yO1xuICAgICAgICBwbGFuZU1lc2gucm90YXRlWCgtTWF0aC5QSSAvIDIpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChwbGFuZU1lc2gpO1xuICAgICAgICBjb25zdCBwbGFuZVNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDMsIDAuNSwgNC41KSlcbiAgICAgICAgY29uc3QgcGxhbmVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KS8v6YeN44GV44KSMOOBq+OBmeOCi+OBqOmHjeWKm+OBruW9semfv+OCkuWPl+OBkeOBquOBhOeJqeS9k+OCkuS9nOOCi+OBk+OBqOOBjOOBp+OBjeOCi++8ge+8ge+8ge+8ge+8gVxuICAgICAgICBwbGFuZUJvZHkuYWRkU2hhcGUocGxhbmVTaGFwZSlcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldChwbGFuZU1lc2gucG9zaXRpb24ueCwgcGxhbmVNZXNoLnBvc2l0aW9uLnktMSwgcGxhbmVNZXNoLnBvc2l0aW9uLnopO1xuICAgICAgICAvL3BsYW5lQm9keS5xdWF0ZXJuaW9uLnNldChwbGFuZU1lc2gucXVhdGVybmlvbi54LCBwbGFuZU1lc2gucXVhdGVybmlvbi55LCBwbGFuZU1lc2gucXVhdGVybmlvbi56LCBwbGFuZU1lc2gucXVhdGVybmlvbi53KTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHBsYW5lQm9keSk7ICAgICAgICBcblxuICAgICAgICBjb25zdCBncmlkSGVscGVyID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoIDEwLCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKCBncmlkSGVscGVyICk7ICBcblxuICAgICAgICBjb25zdCBheGVzSGVscGVyID0gbmV3IFRIUkVFLkF4ZXNIZWxwZXIoIDUgKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoIGF4ZXNIZWxwZXIgKTtcbiAgICAgICAgXG4gICAgICAgIC8vMi5BbWJpZW50TGlnaHRcbiAgICAgICAgbGV0IGxpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMS4wKTsvLyjjg6njgqTjg4jjga7oibIs44Op44Kk44OI44Gu5by344GVKVxuICAgICAgICBsaWdodC5wb3NpdGlvbi5zZXQoMSwgMSwgMSk7Ly/jg6njgqTjg4jjga7kvY3nva5cbiAgICAgICAgLy/jgrfjg7zjg7PlhajkvZPjgavpgannlKjjgZXjgozjgovjg6njgqTjg4jjga7jgZ/jgoHjgIHmlrnlkJHjgajjgYvjga/jgarjgYTjgILlvbHjgoLokL3jgaHjgarjgYTjgIJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGlnaHQpO1xuXG4gICAgICAgIGxldCB3aXNQcmVzc2VkPWZhbHNlO1xuICAgICAgICBsZXQgYWlzUHJlc3NlZD1mYWxzZTtcbiAgICAgICAgbGV0IHNpc1ByZXNzZWQ9ZmFsc2U7XG4gICAgICAgIGxldCBkaXNQcmVzc2VkPWZhbHNlO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1cnOlxuICAgICAgICAgICAgICAgICAgICB3aXNQcmVzc2VkPXRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICAgICAgICAgIGFpc1ByZXNzZWQ9dHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgc2lzUHJlc3NlZD10cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgICAgICBkaXNQcmVzc2VkPXRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdXJzpcbiAgICAgICAgICAgICAgICAgICAgd2lzUHJlc3NlZD1mYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgICAgICAgICAgYWlzUHJlc3NlZD1mYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgc2lzUHJlc3NlZD1mYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgZGlzUHJlc3NlZD1mYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvL+OCr+ODquODg+OCr+OBleOCjOOBn+OBk+OBqOOCkuaknOefpeOBmeOCi+OBn+OCgeOBq+OBr+OAgXJheWNhc3RlcuOBp+WFiee3muOCkuWHuuOBmeW/heimgeOBjOOBguOCi++8n++8n++8nyjjgojjgY/jgo/jgYvjgonjgarjgYTjgZfli5XjgYvjgarjgYQpXG4gICAgICAgIGNvbnN0IHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoKTtcbiAgICAgICAgY29uc3QgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIG1vdXNlLnggPSAoZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIDIgLSAxO1xuICAgICAgICAgICAgbW91c2UueSA9IC0oZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmF5Y2FzdGVyLnNldEZyb21DYW1lcmEobW91c2UsIHRoaXMuY2FtZXJhKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyh0aGlzLmNsaWNrYWJsZU9iamVjdHMsIHRydWUpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcnNlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gaW50ZXJzZWN0c1tpXS5vYmplY3Q7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gR3JpZEhlbHBlcuOChEF4ZXNIZWxwZXLjgarjganjgpLpmaTlpJZcbiAgICAgICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgVEhSRUUuR3JpZEhlbHBlciB8fCBvYmogaW5zdGFuY2VvZiBUSFJFRS5BeGVzSGVscGVyKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBsYWJlbOOBjOOBguOCi+OCquODluOCuOOCp+OCr+ODiOOBruOBv+ihqOekulxuICAgICAgICAgICAgICAgIGlmIChvYmoudXNlckRhdGEgJiYgb2JqLnVzZXJEYXRhLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44Kv44Oq44OD44Kv44GV44KM44Gf44Kq44OW44K444Kn44Kv44OIOlwiLCBvYmoudXNlckRhdGEubGFiZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44Kv44Oq44OD44Kv44GV44KM44Gf44GM44Op44OZ44Or44Gq44GXOlwiLCBvYmoubmFtZSB8fCBvYmoudHlwZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrOyAvLyDmnIDliJ3jgavlvZPjgZ/jgaPjgZ8x44Gk44Gg44GR5Yem55CGXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuZml4ZWRTdGVwKCk7Ly91cGRhdGXplqLmlbDjgafjga/jgIHjgZPjgozjgad3b3JsZOOBrueJqeeQhua8lOeul+OCkuWun+ihjOOBl+OBvuOBmeOAglxuICAgICAgICAgICAgY29uc3Qgd29tYW4gPSB0aGlzLnNjZW5lLmdldE9iamVjdEJ5TmFtZShcIndvbWFuXCIpO1xuICAgICAgICAgICAgaWYod29tYW4pe1xuICAgICAgICAgICAgICAgIHdvbWFuLnBvc2l0aW9uLnNldChjdWJlQm9keS5wb3NpdGlvbi54LCBjdWJlQm9keS5wb3NpdGlvbi55LCBjdWJlQm9keS5wb3NpdGlvbi56KTsvL+acgOW+jOOBq+S9jee9ruOBrueKtuaFi+OBqFxuICAgICAgICAgICAgICAgIHdvbWFuLnF1YXRlcm5pb24uc2V0KGN1YmVCb2R5LnF1YXRlcm5pb24ueCwgY3ViZUJvZHkucXVhdGVybmlvbi55LCBjdWJlQm9keS5xdWF0ZXJuaW9uLnosIGN1YmVCb2R5LnF1YXRlcm5pb24udyk7Ly/lm57ou6Ljga7nirbmhYvjgpJjdWJl44GL44KJ44Kz44OU44O8XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih3b21hbi5wb3NpdGlvbi55PC01MCl7XG4gICAgICAgICAgICAgICAgY3ViZUJvZHkucG9zaXRpb24uc2V0KDAsNSwtMS41KTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIjPnp5LntYzpgY7jgZfjgb7jgZfjgZ9cIik7XG4gICAgICAgICAgICAgICAgICAgIGN1YmVCb2R5LnBvc2l0aW9uLnNldCgtNSwgMTAsIC0xLjUpO1xuICAgICAgICAgICAgICAgIH0sIDMwMDAwKTsgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH1cbiAgICBcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcblxuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg2NDAsIDQ4MCwgbmV3IFRIUkVFLlZlY3RvcjMoMiwgMS42LCAyKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG5cbmNsYXNzIENsYXNzcm9vbXtcbiAgICByb29tOiBUSFJFRS5Hcm91cDtcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCxoZWlnaHQpe1xuICAgICAgICB0aGlzLnJvb209bmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICAgIC8v5Zyw6Z2i44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IHRpbGVXaWR0aD0xO2NvbnN0IHRpbGVIZWlnaHQ9MTtcbiAgICAgICAgY29uc3QgZ2VvbWV0cnk9bmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkodGlsZVdpZHRoLHRpbGVIZWlnaHQpO1xuICAgICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IHRleHR1cmVMb2FkZXIubG9hZCgnZmxvb3IucG5nJyk7XG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IG1hcDogdGV4dHVyZX0gKTsvL+OBk+OBo+OBoeOCkuS9v+OBhuOBqOOCpOODs+ODneODvOODiOOBl+OBn+eUu+WDj+OCkuS9v+OBo+OBn+ODnuODhuODquOCouODq+OCkueUn+aIkOOBp+OBjeOBvuOBmeOAglxuICAgICAgICBmb3IobGV0IGk9MDtpPGhlaWdodDtpKyspe1xuICAgICAgICAgICAgZm9yKGxldCBqPTA7ajx3aWR0aDtqKyspe1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpbGU9bmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksbWF0ZXJpYWwpO1xuICAgICAgICAgICAgICAgIHRpbGUucm90YXRlWCgtTWF0aC5QSS8yKTtcbiAgICAgICAgICAgICAgICB0aWxlLnBvc2l0aW9uLnNldCgtd2lkdGgvMit0aWxlV2lkdGgvMit0aWxlV2lkdGgqaiwwLC1oZWlnaHQvMit0aWxlSGVpZ2h0LzIrdGlsZUhlaWdodCppKTtcbiAgICAgICAgICAgICAgICAvL3RpbGVzLnB1c2godGlsZSk7ICBcbiAgICAgICAgICAgICAgICB0aGlzLnJvb20uYWRkKHRpbGUpOyAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy/lo4Hjga7kvZzmiJBcbiAgICAgICAgY29uc3QgZ3RmTG9hZGVyID0gbmV3IEdMVEZMb2FkZXIoKTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2NsYXNzcm9vbV93YWxsLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMCwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnY2xhc3Nyb29tX2xlZnRXaW5kb3cuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgwLCAwLCAtMS41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdjbGFzc3Jvb21fcmlnaHRXaW5kb3cuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgwLCAwLCAtMS41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdjbGFzc3Jvb21fZnJvbnREb29yLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMCwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnY2xhc3Nyb29tX2JhY2tEb29yLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMCwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnY2xhc3Nyb29tX2NlaWxpbmcuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgwLCAwLCAtMS41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2JsYWNrYm9hcmRfY2VudGVyLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMCwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnYmxhY2tib2FyZF9yaWdodC5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KDAsIDAsIC0xLjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82KTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2JsYWNrYm9hcmRfYmFjay5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KC0wLjE1LCAwLCAtMS41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdjdXJ0YWluX2Nsb3NlZC5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KC0wLjc1LCAwLjIwLCAtMC41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdjdXJ0YWluX29wZW5lZC5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KC0xLCAwLjI1LCAtMS43NSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnYmx1ZV9ib29rLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMCwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgncmVkX2Jvb2suZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgwLCAwLCAtMS41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdjbGVhbmluZ0xvY2tlcl9vcGVuZWQuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgyLjQsIDAsIDQuMik7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4zKndpZHRoLzYsMC4zKndpZHRoLzYsMC4zKndpZHRoLzYpO1xuICAgICAgICAgICAgbW9kZWwucm90YXRlWSgtTWF0aC5QSSk7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdob3VraS5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KDEuOCwgMCwgMi4wKTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdsb2NrZXIuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMS4wLCAwLCAtMS41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjIwKndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCd3b21hbi5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KDEsIDAuMSwgMi41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgxKndpZHRoLzYsMSp3aWR0aC82LDEqd2lkdGgvNik7XG4gICAgICAgICAgICBtb2RlbC5yb3RhdGVaKE1hdGguUEkvMik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2Jvb2tzaGVsZi5nbGInLCAgeyB4OiAtMC41LCB5OiAwLCB6OiAwIH0sIDEpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbCgnYmx1ZV9ib29rLmdsYicsICB7IHg6IC0xMCwgeTogLTUsIHo6IDAgfSwgMSk7XG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdkaXlhbC5nbGInLCAgeyB4OiAyLCB5OiAwLCB6OiAwIH0sIDEpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbCgnc2FmZS5nbGInLCAgeyB4OiAtMCwgeTogMCwgejogMCB9LCAxKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3NhZmVfb3BlbmVkLmdsYicsICB7IHg6IC0yLCB5OiAtNSwgejogMCB9LCAxKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3dvbWFuLmdsYicsICB7IHg6IDAsIHk6IDAsIHo6IDAgfSwgMSk7XG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdzYWthc2FtYV93b21hbi5nbGInLCAgeyB4OiAwLCB5OiAwLCB6OiAwIH0sIDEpOyovXG4gICAgfVxufVxuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX2Nhbm5vbi1lc19kaXN0X2Nhbm5vbi1lc19qcy1ub2RlX21vZHVsZXNfdGhyZWVfYnVpbGRfdGhyZWVfbW9kdWxlX2pzLW5vZC0xMWI2NGNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=