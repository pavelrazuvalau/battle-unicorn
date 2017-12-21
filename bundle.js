/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sprite__ = __webpack_require__(1);


const images = {};
const sprites = {};
const sounds = {};
const successCallbacks = [],
      progressCallbacks = [],
      errorCallbacks = [];
let totalCount = 0,
    loadedCount;

const _loadImage = (src, cb) => {
	const image = new Image();
	image.onload = () => {
		images[src] = image;
		loadedCount = Object.keys(images).length + Object.keys(sounds).length;

		for (const cb of progressCallbacks) {
			cb({ percentage: Math.floor(loadedCount / totalCount * 100) });
		}
		if (loadedCount === totalCount && typeof cb === 'function') {
			cb();
		}
	};

	for (const cb of errorCallbacks) {
		cb('Couldn\'t load image: ' + src);
	}

	image.src = src;
};

const _loadSound = (src, audioDecoder, cb) => {
	const request = new XMLHttpRequest();
	request.open('GET', src, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function () {
		audioDecoder.decodeAudioData(request.response, buffer => {
			sounds[src] = buffer;
			loadedCount = Object.keys(images).length + Object.keys(sounds).length;
			for (const cb of progressCallbacks) {
				cb({ percentage: Math.floor(loadedCount / totalCount * 100) });
			}
			if (loadedCount === totalCount && typeof cb === 'function') {
				cb();
			}
		}, error => {
			for (const cb of errorCallbacks) {
				cb('Couldn\'t load sound: ' + src + '. ' + error);
			}
		});
	};
	request.send();
};

const loadResources = (resources, audioDecoder, sprites) => {
	totalCount = resources.images.length + resources.sounds.length;

	resources.images.forEach(src => _loadImage(src, () => renderResources(sprites)));
	resources.sounds.forEach(src => _loadSound(src, audioDecoder, () => renderResources(sprites)));
};
/* harmony export (immutable) */ __webpack_exports__["d"] = loadResources;


const renderResources = resources => {
	for (const resource in resources) {
		sprites[resource] = new __WEBPACK_IMPORTED_MODULE_0__sprite__["a" /* Sprite */](resources[resource]);
	}

	for (const cb of successCallbacks) {
		cb();
	}
};
/* unused harmony export renderResources */


const onload = cb => successCallbacks.push(cb);
/* harmony export (immutable) */ __webpack_exports__["e"] = onload;


const onprogress = cb => progressCallbacks.push(cb);
/* harmony export (immutable) */ __webpack_exports__["f"] = onprogress;


const getSprite = name => sprites[name];
/* harmony export (immutable) */ __webpack_exports__["c"] = getSprite;


const getImage = src => images[src];
/* harmony export (immutable) */ __webpack_exports__["a"] = getImage;


const getSound = src => sounds[src];
/* harmony export (immutable) */ __webpack_exports__["b"] = getSound;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loader__ = __webpack_require__(0);


class Sprite {
	constructor(config) {
		this.image = __WEBPACK_IMPORTED_MODULE_0__loader__["a" /* getImage */](config.src);
		this.width = config.width;
		this.height = config.height;
		this.animationSpeed = config.animationSpeed;
		this.imagePosition = config.imagePosition;
		this.framesCount = Math.floor(this.image.width / this.width);
		this.statesCount = !this.imagePosition ? Math.floor(this.image.height / this.height) : 1;
		this.frames = [];
		for (let i = 0; i < this.statesCount; i++) {
			this.frames[i] = [];
			for (let j = 0; j < this.framesCount; j++) {
				let frame = document.createElement('canvas');
				frame.width = this.width;
				frame.height = this.height;
				frame.getContext('2d').drawImage(this.image, // image
				j * this.width, // source x
				this.imagePosition ? this.imagePosition : i * this.height, // source y
				this.width, // source width
				this.height, // source height
				0, // target x
				0, // target y
				this.width, // target width
				this.height // target height
				);
				this.frames[i][j] = frame;
			}
		}
		this._index = 0;
	}

	update(delta) {
		if (this.animationSpeed) {
			this._index += this.animationSpeed * delta;
			if (this._index > this.framesCount - 1) {
				this._index = 0;
			}
			if (this._index < 0) {
				this._index = this.framesCount - 1;
			}
		}
	}

	getFrame(frame, state) {
		return this.frames[state ? state : 0][frame];
	}

	getRandomFrame(state) {
		return this.frames[state ? state : 0][Math.floor(Math.random() * this.framesCount)];
	}

	set index(index) {
		this._index = index;
	}

	get index() {
		return Math.floor(this._index);
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Sprite;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sprite__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_states__ = __webpack_require__(3);



class Character {
	constructor(x, y, world, config) {
		this.sprite = new __WEBPACK_IMPORTED_MODULE_0__sprite__["a" /* Sprite */](config);
		this.animationSpeed = config.movementSpeed;
		this.x = x;
		this.y = y;
		this.world = world;
		this.health = config.health;
		this.state = __WEBPACK_IMPORTED_MODULE_1__constants_states__["a" /* STATES */].idleForward;
		this.direction = 1;

		while (this.world.isTileNotWalkable(this.x + this.sprite.width / 2, this.y + this.sprite.height)) {
			this.x = this.x < this.world.width / 2 ? this.x + this.world.tileSize : this.x - this.world.tileSize;
			this.y = this.x < this.world.height / 2 ? this.y + this.world.tileSize : this.y - this.world.tileSize;
		}
	}

	move(delta, x, y) {
		let movedX = Math.round(x * this.animationSpeed * delta),
		    movedY = Math.round(y * this.animationSpeed * delta);

		if (this._isCollidedX(movedX)) {
			movedX = 0;
			x = 0;
		}

		if (this._isCollidedY(movedY)) {
			movedY = 0;
			y = 0;
		}

		this._updateState(x, y);

		this.x += movedX;
		this.y += movedY;

		// clamp values
		this._clampCoordinates();

		return {
			x: movedX,
			y: movedY
		};
	}

	_updateState(x, y) {
		if (x) {
			this.direction = x;
		}

		if (x || y) {
			this.state = this.direction === 1 ? __WEBPACK_IMPORTED_MODULE_1__constants_states__["a" /* STATES */].moveForward : __WEBPACK_IMPORTED_MODULE_1__constants_states__["a" /* STATES */].moveBackward;
		}

		if (!x && !y) {
			this.state = this.direction === 1 ? __WEBPACK_IMPORTED_MODULE_1__constants_states__["a" /* STATES */].idleForward : __WEBPACK_IMPORTED_MODULE_1__constants_states__["a" /* STATES */].idleBackward;
		}
	}

	_isCollidedX(x) {
		return this.x + x < 0 || this.x + x + this.sprite.width > this.world.width || this.world.isTileNotWalkable(this.x + x + this.sprite.width / 2, this.y + this.sprite.height);
	}

	_isCollidedY(y) {
		return this.y + y < 0 || this.y + y + this.sprite.height > this.world.height || this.world.isTileNotWalkable(this.x + this.sprite.width / 2, this.y + y + this.sprite.height);
	}

	_clampCoordinates() {
		const maxX = this.world.columns * this.world.tileSize;
		const maxY = this.world.rows * this.world.tileSize;
		this.x = Math.max(0, Math.min(this.x, maxX));
		this.y = Math.max(0, Math.min(this.y, maxY));
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Character;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const STATES = {
	idleForward: 0,
	idleBackward: 1,
	moveForward: 2,
	moveBackward: 3,
	attackForward: 4,
	attackBackward: 5,
	deathForward: 6,
	deathBackward: 7
};
/* harmony export (immutable) */ __webpack_exports__["a"] = STATES;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loader__ = __webpack_require__(0);


class Weapon {
	constructor(spriteForward, spriteBackward, config) {
		this.spriteForward = spriteForward;
		this.spriteBackward = spriteBackward;
		this.sprite = this.spriteForward;
		this.name = config.name;
		this.fire = __WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('fire');
		this.damage = config.damage;
		this.capacity = config.capacity;
		this.bullets = config.bullets;
		this.reloadTime = config.reloadTime;
		this.speed = config.speed;
		this.availableBullets = config.capacity;
	}

	shot() {
		if (this.availableBullets) {
			if (this.speed) {
				if (!this.lastShot || Date.now() - this.lastShot > this.speed) {
					this.lastShot = Date.now();
					this.availableBullets--;
					return true;
				}
			} else if (!this.isShoted) {
				this.isShoted = true;
				this.availableBullets--;
				return true;
			}
		} else {
			this.reload();
		}

		return false;
	}

	reload() {
		if (this.bullets && this.availableBullets < this.capacity && !this.isReloading) {
			if (this.onReload) {
				this.onReload();
			}

			console.log('reloading...');
			this.isReloading = true;
			this.bullets += this.availableBullets;
			this.availableBullets = 0;
			setTimeout(() => {
				this.availableBullets = this.bullets >= this.capacity ? this.capacity : this.bullets % this.capacity;
				this.bullets = this.bullets >= this.capacity ? this.bullets - this.capacity : 0;
				this.isReloading = false;
			}, this.reloadTime);
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Weapon;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const INVERTORY = {
	pistol: {
		name: 'pistol',
		damage: 9,
		capacity: 7,
		bullets: 35,
		reloadTime: 1500,
		speed: 0
	},
	shotgun: {
		name: 'shotgun',
		damage: 50,
		capacity: 2,
		bullets: 20,
		reloadTime: 2500,
		speed: 0
	},
	assaultRifle: {
		name: 'assaultRifle',
		damage: 20,
		capacity: 30,
		bullets: 120,
		reloadTime: 2500,
		speed: 125
	}
};
/* harmony export (immutable) */ __webpack_exports__["a"] = INVERTORY;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_game__ = __webpack_require__(7);


window.onload = () => {
	const canvas = document.getElementById('game');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
	const context = canvas.getContext('2d');

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();

	const game = new __WEBPACK_IMPORTED_MODULE_0__modules_game__["a" /* Game */](context, audioContext);
	game.run();
};

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__loader__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__world__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__keyboard__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__camera__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__player__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mouse__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sprite__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__enemy__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__constants_keys__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__constants_invertory__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__weapon__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__constants_resources__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__constants_characters__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__constants_sprites__ = __webpack_require__(17);















class Game {
	constructor(context, audioContext) {
		this.context = context;
		this.audioContext = audioContext;
		this.loopedSounds = {};
		this.framesCount = 0;
	}

	init() {
		this.bulletHoles = [];
		this.blood = [];
		this.weapons = [];
		this.enemies = [];
		this.score = 0;
		this.world = new __WEBPACK_IMPORTED_MODULE_1__world__["a" /* World */](30, 30, __WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('map'));
		this.keyboard = new __WEBPACK_IMPORTED_MODULE_2__keyboard__["a" /* Keyboard */](__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */]);
		this.mouse = new __WEBPACK_IMPORTED_MODULE_5__mouse__["a" /* Mouse */]();
		this.player = new __WEBPACK_IMPORTED_MODULE_4__player__["a" /* Player */](this.world, __WEBPACK_IMPORTED_MODULE_12__constants_characters__["a" /* CHARACTERS */].player);
		this.camera = new __WEBPACK_IMPORTED_MODULE_3__camera__["a" /* Camera */](this.world);
		this.camera.follow(this.player);

		this.enemyInterval = setInterval(() => {
			if (!this.isPaused) {
				this.enemies.push(new __WEBPACK_IMPORTED_MODULE_7__enemy__["a" /* Enemy */](this.world, this.player, __WEBPACK_IMPORTED_MODULE_12__constants_characters__["a" /* CHARACTERS */].rat));
				console.log('Generated enemy');
			}
		}, 3000);
		this.weaponInterval = setInterval(() => {
			if (!this.isPaused) {
				const probability = Math.random();
				if (this.score >= 3000 && probability < 0.5) {
					this.weapons.push(new __WEBPACK_IMPORTED_MODULE_10__weapon__["a" /* Weapon */](__WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('assaultRifle'), __WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('assaultRifleBackward'), __WEBPACK_IMPORTED_MODULE_9__constants_invertory__["a" /* INVERTORY */].assaultRifle));
				} else if (this.score >= 1000 && probability < 0.5) {
					this.weapons.push(new __WEBPACK_IMPORTED_MODULE_10__weapon__["a" /* Weapon */](__WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('shotgun'), __WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('shotgunBackward'), __WEBPACK_IMPORTED_MODULE_9__constants_invertory__["a" /* INVERTORY */].shotgun));
				} else {
					this.weapons.push(new __WEBPACK_IMPORTED_MODULE_10__weapon__["a" /* Weapon */](__WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('pistol'), __WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('pistolBackward'), __WEBPACK_IMPORTED_MODULE_9__constants_invertory__["a" /* INVERTORY */].pistol));
				}
				this.weapons[this.weapons.length - 1].x = Math.floor(Math.random() * this.world.width);
				this.weapons[this.weapons.length - 1].y = Math.floor(Math.random() * this.world.height);

				console.log('Generated weapon');
			}
		}, 10000);
	}

	update(delta) {
		let dirx = 0,
		    diry = 0,
		    moved;

		if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].left)) {
			dirx = -1;
		} else if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].right)) {
			dirx = 1;
		}

		if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].up)) {
			diry = -1;
		} else if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].down)) {
			diry = 1;
		}

		this.player.mousex = this.mouse.x;
		this.player.mousey = this.mouse.y;

		this.player.sprite.update(delta);
		moved = this.player.move(delta, dirx, diry);

		if ((dirx || diry) && !this.loopedSounds['trot'] && (moved.x || moved.y)) {
			this.playLoopedSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/trot.mp3'), 'trot');
		} else if ((!dirx && !diry || !moved.x && !moved.y) && this.loopedSounds['trot']) {
			this.stopLoopedSound('trot');
		}

		for (let weapon of this.weapons) {
			if (weapon.x >= this.player.x && weapon.x <= this.player.x + this.player.sprite.width && weapon.y >= this.player.y && weapon.y <= this.player.y + this.player.sprite.height) {
				if (this.player.invertory[weapon.name]) {
					this.player.invertory[weapon.name].bullets += weapon.bullets;
				} else {
					this.player.invertory[weapon.name] = weapon;
					this.player.currentItem = weapon;
				}

				this.playSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/pickup.mp3'));

				this.weapons.splice(this.weapons.indexOf(weapon), 1);
			}
		}

		if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].pistol) && this.player.invertory.pistol && this.player.invertory.pistol.bullets && (!this.player.currentItem || this.player.currentItem.name !== 'pistol')) {
			this.player.currentItem = this.player.invertory.pistol;
			this.playSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/pickup.mp3'));
		}

		if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].shotgun) && this.player.invertory.shotgun && this.player.invertory.shotgun.bullets && (!this.player.currentItem || this.player.currentItem.name !== 'shotgun')) {
			this.player.currentItem = this.player.invertory.shotgun;
			this.playSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/pickup.mp3'));
		}

		if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].assaultRifle) && this.player.invertory.assaultRifle && this.player.invertory.assaultRifle.bullets && (!this.player.currentItem || this.player.currentItem.name !== 'assaultRifle')) {
			this.player.currentItem = this.player.invertory.assaultRifle;
			this.playSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/pickup.mp3'));
		}

		let isEnemyHinted = false,
		    isPlayerHinted,
		    hitX,
		    hitY;

		if (this.player.currentItem) {
			if (!this.player.currentItem.onReload) {
				this.player.currentItem.onReload = () => this.playSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/' + this.player.currentItem.name + 'Reload.mp3'));
			}
			if (!this.player.currentItem.availableBullets && !this.player.currentItem.bullets) {
				this.player.invertory[this.player.currentItem.name] = null;
				this.player.currentItem = null;
			} else {
				if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].reload)) {
					this.player.currentItem.reload();
				}

				if (this.mouse.isClicked && !this.player.currentItem.isShoted && !this.player.currentItem.isReloading) {
					if (this.player.currentItem.shot()) {
						hitX = this.camera.x + this.mouse.x;
						hitY = this.camera.y + this.mouse.y;
						console.log(this.player.currentItem.availableBullets + ' / ' + this.player.currentItem.bullets);
						this.isFlameAppeared = true;
						setTimeout(() => this.isFlameAppeared = false, 50);
						this.playSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/' + this.player.currentItem.name + '.mp3'));
					}
				} else if (!this.mouse.isClicked) {
					// We also have non-automatic weapons (pistol, shotgun)
					this.player.currentItem.isShoted = false;
				}
			}
		}

		// Update enemies state
		for (let enemy of this.enemies) {
			enemy.sprite.update(delta);

			if (enemy.attackPlayer(delta) && !isPlayerHinted) {
				this.playSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/' + enemy.name + 'Attack.mp3'));
				isPlayerHinted = true;
			}

			if (hitX && hitY) {
				if (hitX >= enemy.x && hitX <= enemy.x + enemy.sprite.width && hitY >= enemy.y && hitY <= enemy.y + enemy.sprite.height) {
					enemy.health -= this.player.currentItem.damage;
					isEnemyHinted = true;

					console.log('Enemy health - ' + enemy.health);
					if (enemy.health <= 0) {
						this.playSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/' + enemy.name + 'Death.mp3'));
						this.enemies.splice(this.enemies.indexOf(enemy), 1);
						this.score += enemy.award;
						console.log('Score - ' + this.score);
					}

					break;
				}
			}
		}

		if (isPlayerHinted) {
			let blood = new __WEBPACK_IMPORTED_MODULE_6__sprite__["a" /* Sprite */](__WEBPACK_IMPORTED_MODULE_13__constants_sprites__["a" /* SPRITES */].blood);
			blood.index = Math.random() * blood.framesCount;
			this.blood.push({
				x: this.player.x + this.player.sprite.width / 2,
				y: this.player.y + this.player.sprite.height / 2,
				sprite: blood
			});
			setTimeout(() => {
				this.blood.splice(this.blood.indexOf(blood), 1);
			}, 10000);
		}

		if (hitX && hitY) {
			if (isEnemyHinted) {
				let blood = new __WEBPACK_IMPORTED_MODULE_6__sprite__["a" /* Sprite */](__WEBPACK_IMPORTED_MODULE_13__constants_sprites__["a" /* SPRITES */].blood);
				blood.index = Math.random() * blood.framesCount;
				this.blood.push({
					x: hitX,
					y: hitY,
					sprite: blood
				});
				setTimeout(() => {
					this.blood.splice(this.blood.indexOf(blood), 1);
				}, 10000);
			} else {
				let bulletHole = {
					x: hitX,
					y: hitY,
					sprite: __WEBPACK_IMPORTED_MODULE_0__loader__["c" /* getSprite */]('hole')
				};
				this.bulletHoles.push(bulletHole);
				setTimeout(() => {
					this.bulletHoles.splice(this.bulletHoles.indexOf(bulletHole), 1);
				}, 10000);
			}
		}

		this.camera.update();

		if (this.keyboard.isDown(__WEBPACK_IMPORTED_MODULE_8__constants_keys__["a" /* KEYS */].pause)) {
			this.pause();
		}

		if (this.player.health <= 0) {
			return this.gameOver();
		}
	}

	render() {
		// Render map
		const startCol = Math.floor(this.camera.x / this.world.tileSize);
		const endCol = startCol + this.camera.width / this.world.tileSize;
		const startRow = Math.floor(this.camera.y / this.world.tileSize);
		const endRow = startRow + this.camera.height / this.world.tileSize;
		const offsetX = -this.camera.x + startCol * this.world.tileSize;
		const offsetY = -this.camera.y + startRow * this.world.tileSize;

		for (let column = startCol; column <= endCol + 1; column++) {
			for (let row = startRow; row <= endRow + 1; row++) {
				if (this.world.map[row] && typeof this.world.map[row][column] !== 'undefined') {
					let x = Math.floor((column - startCol) * this.world.tileSize + offsetX);
					let y = Math.floor((row - startRow) * this.world.tileSize + offsetY);
					this.context.drawImage(this.world.sprite.getFrame(this.world.map[row][column]), x, y);
				}
			}
		}

		// Render blood
		for (const blood of this.blood) {
			if (this.camera.isInBounds(blood.x, blood.y)) {
				this.context.drawImage(blood.sprite.getFrame(blood.sprite.index), Math.floor(blood.x - this.camera.x - blood.sprite.width / 2), Math.floor(blood.y - this.camera.y - blood.sprite.height / 2));
			}
		}

		// Render bullet holes
		for (const hole of this.bulletHoles) {
			if (this.camera.isInBounds(hole.x, hole.y)) {
				this.context.drawImage(hole.sprite.getFrame(0), Math.floor(hole.x - this.camera.x - hole.sprite.width / 2), Math.floor(hole.y - this.camera.y - hole.sprite.height / 2));
			}
		}

		// Render weapons
		for (const weapon of this.weapons) {
			if (this.camera.isInBounds(weapon.x, weapon.y)) {
				this.context.drawImage(weapon.sprite.getFrame(0), Math.floor(weapon.x - this.camera.x - weapon.sprite.width / 2), Math.floor(weapon.y - this.camera.y - weapon.sprite.height / 2));
			}
		}

		// Render player
		this.context.drawImage(this.player.sprite.getFrame(this.player.sprite.index, this.player.state), this.player.screenX, this.player.screenY);

		// Render enemies
		for (let enemy of this.enemies) {
			if (this.camera.isInBounds(enemy.x, enemy.y) || this.camera.isInBounds(enemy.x + enemy.sprite.width, enemy.y + enemy.sprite.height)) {
				this.context.drawImage(enemy.sprite.getFrame(enemy.sprite.index, enemy.state), enemy.x - this.camera.x, enemy.y - this.camera.y);
			}
		}

		// Render player's weapon
		if (this.player.currentItem && !this.player.currentItem.isReloading) {
			this.context.drawImage(this.player.currentItem.sprite.getFrame(0), this.player.direction > 0 ? this.player.screenX + this.player.sprite.width : this.player.screenX - this.player.currentItem.sprite.width, this.player.screenY + 35);
		}

		// Render weapon fire
		if (this.player.currentItem && this.isFlameAppeared) {
			this.context.drawImage(this.player.currentItem.fire.getFrame(0, this.player.direction > 0 ? 0 : 1), this.player.direction > 0 ? this.player.screenX + this.player.sprite.width + this.player.currentItem.sprite.width : this.player.screenX - this.player.currentItem.sprite.width - 50, this.player.screenY + 23);
		}

		// Render HUD
		this.context.rect(70, window.innerHeight - 100, 400, 25);

		// Health bar
		this.context.strokeStyle = '#14ff17';
		this.context.fillStyle = '#14ff17';
		this.context.stroke();
		this.context.fillRect(70, window.innerHeight - 100, 400 * (this.player.health / 100), 25);

		// Text style
		this.context.font = '36px Overseer';
		this.context.textAlign = 'center';

		// Score
		this.context.fillText('Score: ' + this.score, Math.floor(window.innerWidth / 2), window.innerHeight - 75);

		// Weapon
		if (this.player.currentItem) {
			this.context.fillText(this.player.currentItem.availableBullets + ' / ' + this.player.currentItem.bullets, window.innerWidth - 100, window.innerHeight - 75);
		}
	}

	run() {
		this._previousElapsed = 0;
		__WEBPACK_IMPORTED_MODULE_0__loader__["f" /* onprogress */](progress => {
			console.log(progress.percentage);
			document.getElementById('loadingBar').style.width = progress.percentage + '%';
		});
		__WEBPACK_IMPORTED_MODULE_0__loader__["e" /* onload */](() => {
			this.playLoopedSound(__WEBPACK_IMPORTED_MODULE_0__loader__["b" /* getSound */]('sound/background.mp3'), 'background', 0.2);
			document.getElementById('loading').style.display = 'none';
			document.getElementById('menu').style.display = 'block';

			document.getElementById('mainImage').appendChild(__WEBPACK_IMPORTED_MODULE_0__loader__["a" /* getImage */]('img/main.png'));

			document.getElementById('start').onclick = () => {
				document.getElementById('main').style.display = 'none';
				this.init();
				window.requestAnimationFrame(this.tick.bind(this));
			};
		});
		__WEBPACK_IMPORTED_MODULE_0__loader__["d" /* loadResources */](__WEBPACK_IMPORTED_MODULE_11__constants_resources__["a" /* RESOURCES */], this.audioContext, __WEBPACK_IMPORTED_MODULE_13__constants_sprites__["a" /* SPRITES */]);
	}

	tick(elapsed) {
		if (!this.isPaused) {
			window.requestAnimationFrame(this.tick.bind(this));

			// clear previous frame
			this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

			// compute delta time in seconds -- also cap it
			elapsed = Math.floor(elapsed);
			let delta = (elapsed - this._previousElapsed) / 1000.0;
			delta = Math.min(delta, 0.25); // maximum delta of 250 ms
			this._previousElapsed = elapsed;

			this.update(delta);
			this.render();
		}
	}

	playSound(buffer) {
		const source = this.audioContext.createBufferSource(); // creates a sound source
		source.buffer = buffer; // tell the source which sound to play
		source.connect(this.audioContext.destination); // connect the source to the context's destination (the speakers)
		source.start(0);
	}

	playLoopedSound(buffer, name, volume = 1) {
		const source = this.audioContext.createBufferSource(); // creates a sound source
		source.buffer = buffer; // tell the source which sound to play
		source.loop = true;
		const gainNode = this.audioContext.createGain(); // Connect the source to the gain node.
		source.connect(gainNode); // Connect the gain node to the destination.
		gainNode.connect(this.audioContext.destination);
		gainNode.gain.value = volume;

		this.loopedSounds[name] = source;

		source.start(0);
	}

	stopLoopedSound(name) {
		this.loopedSounds[name].stop();
		this.loopedSounds[name] = null;
	}

	pause() {
		this.isPaused = true;

		if (this.loopedSounds['trot']) {
			this.loopedSounds['trot'].stop();
			this.loopedSounds['trot'] = null;
		}

		document.getElementById('pause').style.display = 'block';
		document.getElementById('pauseImage').appendChild(__WEBPACK_IMPORTED_MODULE_0__loader__["a" /* getImage */]('img/pause.png'));
		document.getElementById('resume').onclick = this.unpause.bind(this);
	}

	unpause() {
		document.getElementById('pause').style.display = 'none';
		this.isPaused = false;
		window.requestAnimationFrame(this.tick.bind(this));
	}

	gameOver() {
		console.log('Game over');
		this.isPaused = true;
		clearInterval(this.enemyInterval);
		clearInterval(this.weaponInterval);

		if (this.loopedSounds['trot']) {
			this.loopedSounds['trot'].stop();
			this.loopedSounds['trot'] = null;
		}

		document.getElementById('gameOver').style.display = 'block';
		document.getElementById('gameOverImage').appendChild(__WEBPACK_IMPORTED_MODULE_0__loader__["a" /* getImage */]('img/gameOver.png'));
		document.getElementById('score').innerText = this.score;
		document.getElementById('tryAgain').onclick = this.reset.bind(this);
	}

	reset() {
		document.getElementById('gameOver').style.display = 'none';

		this.init();
		this.isPaused = false;
		window.requestAnimationFrame(this.tick.bind(this));
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class World {
	constructor(rows, columns, map) {
		this.rows = rows;
		this.columns = columns;
		this.tileSize = map.width;
		this.width = columns * this.tileSize;
		this.height = rows * this.tileSize;
		this.sprite = map;

		this.map = [];
		for (let row = 0; row < rows; row++) {
			this.map[row] = [];
			for (let column = 0; column < columns; column++) {
				if (Math.random() < 0.1) {
					this.map[row][column] = Math.floor(Math.random() * 5);
				} else {
					this.map[row][column] = 0;
				}
			}
		}
	}

	getIndex(coordinate) {
		return Math.floor(coordinate / this.tileSize);
	}

	isTileNotWalkable(x, y) {
		const row = this.getIndex(y);
		const column = this.getIndex(x);

		return this.map[row] && this.map[row][column] > 0;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = World;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Keyboard {
	constructor(keys) {
		this.keysPressed = {};
		// keys.forEach((key) => {
		// 	this.keysPressed[key] = false;
		// });
		// for (const key in keys) {
		// 	this.keysPressed[keys[key]] = false;
		// }

		for (const key of Object.keys(keys)) {
			this.keysPressed[keys[key]] = false;
		}

		window.addEventListener('keydown', this.onKeyDown.bind(this));
		window.addEventListener('keyup', this.onKeyUp.bind(this));
		window.addEventListener('blur', () => {
			for (const key of Object.keys(keys)) {
				this.keysPressed[keys[key]] = false;
			}
		});
	}

	onKeyDown(event) {
		const keyCode = event.keyCode;
		if (keyCode in this.keysPressed) {
			event.preventDefault();
			this.keysPressed[keyCode] = true;
		}
	}

	onKeyUp(event) {
		const keyCode = event.keyCode;
		if (keyCode in this.keysPressed) {
			event.preventDefault();
			this.keysPressed[keyCode] = false;
		}
	}

	isDown(keyCode) {
		return this.keysPressed[keyCode];
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Keyboard;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Camera {
	constructor(map) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.maxX = map.columns * map.tileSize - this.width;
		this.maxY = map.rows * map.tileSize - this.height;
		this.x = this.width / 2;
		this.y = this.height / 2;

		window.addEventListener('resize', () => {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
			this.maxX = map.columns * map.tileSize - this.width;
			this.maxY = map.rows * map.tileSize - this.height;
		});
	}

	follow(player) {
		this.following = player;
	}

	update() {
		// assume followed sprite should be placed at the center of the screen
		// whenever possible
		this.following.screenX = Math.floor(this.width / 2 - this.following.sprite.width / 2);
		this.following.screenY = Math.floor(this.height / 2 - this.following.sprite.height / 2);

		// make the camera follow the sprite
		this.x = Math.floor(this.following.x - this.following.screenX);
		this.y = Math.floor(this.following.y - this.following.screenY);
		// clamp values
		this.x = Math.max(0, Math.min(this.x, this.maxX));
		this.y = Math.max(0, Math.min(this.y, this.maxY));

		// in map corners, the sprite cannot be placed in the center of the screen
		// and we have to change its screen coordinates

		// left and right sides
		if (this.following.x < this.following.screenX || this.following.x > this.maxX + this.following.screenX) {
			this.following.screenX = this.following.x - this.x;
		}
		// top and bottom sides
		if (this.following.y < this.following.screenY || this.following.y > this.maxY + this.following.screenY) {
			this.following.screenY = this.following.y - this.y;
		}
	}

	isInBounds(x, y) {
		return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Camera;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__character__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sprite__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants_states__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__weapon__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__constants_invertory__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__loader__ = __webpack_require__(0);







class Player extends __WEBPACK_IMPORTED_MODULE_0__character__["a" /* Character */] {
	constructor(world, config) {
		super(world.width / 2, world.height / 2, world, config.default);
		this.defaultSprite = this.sprite;
		this.activeSprite = new __WEBPACK_IMPORTED_MODULE_1__sprite__["a" /* Sprite */](config.active); // lightning unicorn
		this.screenX = this.x;
		this.screenY = this.y;

		this.invertory = {
			pistol: new __WEBPACK_IMPORTED_MODULE_3__weapon__["a" /* Weapon */](__WEBPACK_IMPORTED_MODULE_5__loader__["c" /* getSprite */]('pistol'), __WEBPACK_IMPORTED_MODULE_5__loader__["c" /* getSprite */]('pistolBackward'), __WEBPACK_IMPORTED_MODULE_4__constants_invertory__["a" /* INVERTORY */].pistol),
			shotgun: new __WEBPACK_IMPORTED_MODULE_3__weapon__["a" /* Weapon */](__WEBPACK_IMPORTED_MODULE_5__loader__["c" /* getSprite */]('shotgun'), __WEBPACK_IMPORTED_MODULE_5__loader__["c" /* getSprite */]('shotgunBackward'), __WEBPACK_IMPORTED_MODULE_4__constants_invertory__["a" /* INVERTORY */].shotgun),
			assaultRifle: new __WEBPACK_IMPORTED_MODULE_3__weapon__["a" /* Weapon */](__WEBPACK_IMPORTED_MODULE_5__loader__["c" /* getSprite */]('assaultRifle'), __WEBPACK_IMPORTED_MODULE_5__loader__["c" /* getSprite */]('assaultRifleBackward'), __WEBPACK_IMPORTED_MODULE_4__constants_invertory__["a" /* INVERTORY */].assaultRifle)
		};
		this.currentItem = this.invertory.pistol;
	}

	_updateState(x, y) {
		this.sprite = this.currentItem ? this.activeSprite : this.defaultSprite;
		this.direction = this.mousex > this.screenX + this.sprite.width / 2 ? 1 : -1;

		if (this.currentItem) {
			this.currentItem.sprite = this.direction > 0 ? this.currentItem.spriteForward : this.currentItem.spriteBackward;
		}

		if (x || y) {
			this.state = this.direction === 1 ? __WEBPACK_IMPORTED_MODULE_2__constants_states__["a" /* STATES */].moveForward : __WEBPACK_IMPORTED_MODULE_2__constants_states__["a" /* STATES */].moveBackward;
			if (x * this.direction * this.sprite.animationSpeed < 0) {
				this.sprite.animationSpeed = -this.sprite.animationSpeed;
			}
		}

		if (!x && !y) {
			this.state = this.direction === 1 ? __WEBPACK_IMPORTED_MODULE_2__constants_states__["a" /* STATES */].idleForward : __WEBPACK_IMPORTED_MODULE_2__constants_states__["a" /* STATES */].idleBackward;
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Mouse {
	constructor() {
		this.x = 0;
		this.y = 0;
		window.addEventListener('mousemove', event => {
			this.x = event.clientX;
			this.y = event.clientY;
		});
		window.addEventListener('mousedown', () => {
			this.isClicked = true;
		});
		window.addEventListener('mouseup', () => {
			this.isClicked = false;
		});
		window.addEventListener('blur', () => {
			this.isClicked = false;
		});
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Mouse;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__character__ = __webpack_require__(2);


class Enemy extends __WEBPACK_IMPORTED_MODULE_0__character__["a" /* Character */] {
	constructor(world, player, config) {
		super(Math.floor(Math.random() * world.width - config.width), Math.floor(Math.random() * world.height - config.height), world, config);
		this.name = config.name;
		this.player = player;
		this.damage = config.damage;
		this.attackSpeed = config.attackSpeed;
		this.award = config.award;
	}

	attackPlayer(delta) {
		if (Math.sqrt(Math.pow(Math.abs(this.x - this.player.x), 2) + Math.pow(Math.abs(this.y - this.player.y), 2)) > 60) {
			let x = 0,
			    y = 0;

			if (this.x > this.player.x) {
				x = -1;
			} else if (this.x < this.player.x) {
				x = 1;
			}

			if (this.y > this.player.y) {
				y = -1;
			} else if (this.y < this.player.y) {
				y = 1;
			}

			super.move(delta, x, y);
		} else {
			// attack
			if (!this.isAttacking) {
				this.player.health -= this.damage;
				console.log('Player health - ' + this.player.health);
				this.isAttacking = true;
				setTimeout(() => {
					this.isAttacking = false;
				}, this.attackSpeed);
				return true;
			}
		}

		return false;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Enemy;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const KEYS = {
	up: 87,
	down: 83,
	left: 65,
	right: 68,
	pistol: 49,
	shotgun: 50,
	assaultRifle: 51,
	reload: 82,
	pause: 27
};
/* harmony export (immutable) */ __webpack_exports__["a"] = KEYS;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const RESOURCES = {
	images: ['img/main.png', 'img/pause.png', 'img/gameOver.png', 'img/map.png', 'img/player.png', 'img/playerActive.png', 'img/aim.png', 'img/weapon.png', 'img/hole.png', 'img/fire.png', 'img/blood.png', 'img/rat.png'],
	sounds: ['sound/background.mp3', 'sound/trot.mp3', 'sound/pickup.mp3', 'sound/empty.mp3', 'sound/pistol.mp3', 'sound/pistolReload.mp3', 'sound/shotgun.mp3', 'sound/shotgunReload.mp3', 'sound/assaultRifle.mp3', 'sound/assaultRifleReload.mp3', 'sound/ratAttack.mp3', 'sound/ratDeath.mp3']
};
/* harmony export (immutable) */ __webpack_exports__["a"] = RESOURCES;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const CHARACTERS = {
	player: {
		default: {
			src: 'img/player.png',
			width: 106,
			height: 96,
			animationSpeed: 16,
			movementSpeed: 155,
			health: 100
		},
		active: {
			src: 'img/playerActive.png',
			width: 106,
			height: 96,
			animationSpeed: 16,
			movementSpeed: 155,
			health: 100
		}
	},
	rat: {
		name: 'rat',
		src: 'img/rat.png',
		width: 96.25,
		height: 46,
		animationSpeed: 14,
		movementSpeed: 100,
		health: 50,
		damage: 5,
		attackSpeed: 2000,
		award: 100
	}
};
/* harmony export (immutable) */ __webpack_exports__["a"] = CHARACTERS;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const SPRITES = {
	hole: {
		src: 'img/hole.png',
		width: 10,
		height: 10
	},
	blood: {
		src: 'img/blood.png',
		width: 50,
		height: 50
	},
	fire: {
		src: 'img/fire.png',
		width: 50,
		height: 35
	},
	map: {
		src: 'img/map.png',
		width: 71,
		height: 71
	},
	pistol: {
		src: 'img/weapon.png',
		width: 23,
		height: 16,
		imagePosition: 0
	},
	pistolBackward: {
		src: 'img/weapon.png',
		width: 23,
		height: 16,
		imagePosition: 16
	},
	shotgun: {
		src: 'img/weapon.png',
		width: 59,
		height: 21,
		imagePosition: 32
	},
	shotgunBackward: {
		src: 'img/weapon.png',
		width: 59,
		height: 21,
		imagePosition: 53
	},
	assaultRifle: {
		src: 'img/weapon.png',
		width: 68,
		height: 16,
		imagePosition: 74
	},
	assaultRifleBackward: {
		src: 'img/weapon.png',
		width: 68,
		height: 16,
		imagePosition: 90
	}
};
/* harmony export (immutable) */ __webpack_exports__["a"] = SPRITES;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map