

import eventemitter3 from 'eventemitter3';

// возвращает целое число от min включительно до max включительно
function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * Math.floor(max));
}

let MapCell_id = 0;
class MapCell {
	constructor({ x, y }, ship = 0, damaged = 0) {
		this.id = MapCell_id++;
		this.ship = ship; // 0 - none; 1 - user; 2 - pc;
		this.damaged = damaged; // 0 - не тронутая, 1 - уже попали по этой точке
		this.marked = 0;  // 0 - неизвестна; 1 - тут точно ничего нет(потоплен корабль рядом)
		this.x = x;
		this.y = y;
	}

	setShip(ship) { this.ship = ship; }
	setDamaged(d) {
		if (!this.damaged) {
			this.damaged = d;
			if (this.ship) this.ship.setDamagedCell(this);
		}
	}
	setMarked(d) { this.marked = d; }
	getShip() { return this.ship; }

	isMarked() { return this.marked; }
	isDamaged() { return this.damaged; }

}

// PlayerShip отвечает за разворот и размер корабля и состояние
class PlayerShip {
	constructor(name, playerShipId, size, position = 0) {
		this.name = name;
		this.location = { x: -1, y: -1 };
		this.playerShipId = playerShipId;
		this.size = size;
		this.position = position;  // 1 - horizontal, 2 - vertical, 0 - random
		if (position == 0) this.position = Math.round(1 + Math.random());
		this.cntSafeCells = size;
		this.cells = [];
		if (size > 4) throw ('Размер корабля не может быть больше 4 ячеек');
		if (size < 1) throw ('Размер корабля не может быть меньше 1 ячееки');
	}

	getPosition() { return this.position; }
	getSize() { return this.size; }
	getCntSafeCells() { return this.cntSafeCells; }
	getCells() { return this.cells; }
	isDestroyed() { return !this.cntSafeCells; }
	isDamaged() { return this.cntSafeCells != this.size; }


	addCell(cell) {
		cell.setShip(this);
		this.cells.push(cell);
	}
	setDamagedCell(cell) {
		this.cntSafeCells--;
		if (this.cntSafeCells < 0) throw ('все ячейки корабля уже уничтожены');
	}

	setLocation({ x, y }) { this.location = { x: x, y: y }; }
	getLocation() { return this.location; }
}

// PlayerShips следит за кораблями игрока
class PlayerShips {
	constructor(mapSize) {

		this.ships = {};
		let id = 20;
		this.ships[id] = new PlayerShip('четырехпалубный', id++, 4);
		this.ships[id] = new PlayerShip('трехпалубный', id++, 3);
		this.ships[id] = new PlayerShip('трехпалубный', id++, 3);
		this.ships[id] = new PlayerShip('двухпалубный', id++, 2);
		this.ships[id] = new PlayerShip('двухпалубный', id++, 2);
		this.ships[id] = new PlayerShip('двухпалубный', id++, 2);
		this.ships[id] = new PlayerShip('однопалубный', id++, 1);
		this.ships[id] = new PlayerShip('однопалубный', id++, 1);
		this.ships[id] = new PlayerShip('однопалубный', id++, 1);
		this.ships[id] = new PlayerShip('однопалубный', id++, 1);
		this.cntSafeShips = this.ships.length;

		let freemapSize = mapSize;
		let map = [];
		for (let i = 0; i < freemapSize; i++) {
			map[i] = [];
			for (let j = 0; j < freemapSize; j++) {
				map[i][j] = 0;  // 0 - свободна; 1 - соседние ячейки заняты; 2 - занята
			}
		}
		this.freeMap = map;
		this.freemapSize = freemapSize;

		for (let i in this.ships) {
			let ship = this.ships[i];
			this.setShipToRandomFreeMap(ship);
		}
	}

	// возврващает 0 или корабль по координатам x,y
	getCellShip({ x, y }) {
		let id = this.freeMap[x][y];
		if (id < 10) return 0;
		return this.ships[id];
	}

	// setShipToRandomFreeMap - задает кораблю случайное положение свободной на карте
	setShipToRandomFreeMap(ship) {
		let sz = ship.getSize();
		let hv = ship.getPosition();

		let map = this.freeMap;
		let mapsizeH = this.freemapSize;
		let mapsizeV = this.freemapSize;
		let needmapsizeH = mapsizeH;
		let needmapsizeV = mapsizeV;

		// в какой области можно поставить первую ячейку корабля
		if (hv == 1) needmapsizeH -= sz;
		else needmapsizeV -= sz;

		// выбираем случайные ячейки для первой ячейки корабля из возможной обсласти
		let posH = getRandomInt(0, needmapsizeH);
		let posV = getRandomInt(0, needmapsizeV);

		// определяем не заняты ли ячейки для остальных ячеек корабля
		for (let i = 0; i < sz; i++) {
			let b = 0
			if (hv == 1) {
				b = map[posH + i][posV];
			} else {
				b = map[posH][posV + i];
			}
			if (b != 0) { // если ячейка уже занята (или занята соседняя ячейка)
				//пробуем вычислить следующее случайное положение
				return this.setShipToRandomFreeMap(ship);
			}
		}

		//если корабль можно установить то 
		// ставим отметки на карте что эти и соседние ячейки уже заняты
		for (let i = 0; i < sz; i++) {
			let iposH = posH;
			let iposV = posV;
			if (hv == 1) iposH += i;
			else iposV += i;
			this.setCellShipped(ship, iposH, iposV);
		}

		ship.setLocation({ x: posH, y: posV });
	}

	//задаем что эта ячейка уже занята кораблем(id) и соседние ячейки тоже(1) не занимать )
	setCellShipped(ship, x, y) {
		let sz = this.freemapSize;
		let map = this.freeMap;
		map[x][y] = ship.playerShipId;
		if (x > 0) {
			if (map[x - 1][y] == 0) map[x - 1][y] = 1;
			if (y + 1 < sz && map[x - 1][y + 1] == 0) map[x - 1][y + 1] = 1;
		}
		if (y > 0) {
			if (map[x][y - 1] == 0) map[x][y - 1] = 1;
			if (x + 1 < sz && map[x + 1][y - 1] == 0) map[x + 1][y - 1] = 1;
			if (x > 0 && map[x - 1][y - 1] == 0) map[x - 1][y - 1] = 1;
		}
		if (x + 1 < sz) {
			if (map[x + 1][y] == 0) map[x + 1][y] = 1;
		}
		if (y + 1 < sz) {
			if (map[x][y + 1] == 0) map[x][y + 1] = 1;
			if (x + 1 < sz && map[x + 1][y + 1] == 0) map[x + 1][y + 1] = 1;
		}
	}



	// выводит строку с картой занятых и свободных ячеек
	getFreeMapStr() {
		let map = this.freeMap;
		let mapSize = this.freemapSize;
		let s = '';
		for (let i = 0; i < mapSize; i++) {
			for (let j = 0; j < mapSize; j++) {
				let b = map[i][j];
				s += '  ' + String(b).padStart(3, ' ');
			}
			s += '\n';
		}
		return s;
	}

	getShipsInfo() {
		let d = {};
		d.cntTotalShips = 0;
		d.cntSafeShips = 0;
		d.cntDestroyShips = 0;
		d.cntDamageShips = 0;
		d.safeShips = {};
		d.damageShips = {};
		d.destroyShips = {};
		for (let i in this.ships) {
			d.cntTotalShips++;
			let ship = this.ships[i];
			let name = ship.name;
			if (!ship.isDamaged()) {
				d.cntSafeShips++;
				if (!d.safeShips[name]) d.safeShips[name] = 0;
				d.safeShips[name]++;
			} else if (ship.isDestroyed()) {
				d.cntDestroyShips++;
				if (!d.destroyShips[name]) d.destroyShips[name] = 0;
				d.destroyShips[name]++;
			} else if (ship.isDamaged()) {
				d.cntSafeShips++;
				if (!d.safeShips[name]) d.safeShips[name] = 0;
				d.safeShips[name]++;
				d.cntDamageShips++;
				if (!d.damageShips[name]) d.damageShips[name] = 0;
				d.damageShips[name]++;
			}
		}
		return d;
	}
}


//PlayerMap хранит и отвечает за ячйки карты одного из игроков
export class PlayerMap extends eventemitter3 {
	constructor(mapSize) {
		if (mapSize < 10) throw ('Размер карты не может быть меньше 10 ячеек');
		super();
		this.createShips(mapSize);
		this.createMap(mapSize);
	}

	createShips(mapSize) {
		this.ships = new PlayerShips(mapSize);
	}

	createMap(mapSize) {
		let ships = this.ships;
		this.mapSize = mapSize;
		let map = [];
		for (let i = 0; i < mapSize; i++) {
			for (let j = 0; j < mapSize; j++) {
				let cell = new MapCell({ x: i, y: j });
				map.push(cell);
				let ship = ships.getCellShip({ x: i, y: j });
				if (ship) { ship.addCell(cell); }
			}
		}
		this.map = map;
	}

	getMapSize() { return this.mapSize; }
	getFreeMapStr() { return this.ships.getFreeMapStr(); }


	getMapCells() {
		let map = this.map;
		return map;
	}

	getMapData() { return this; }
	setMapData(p) {
		this.map = p.map;
		this.mapSize = p.mapSize;
		this.ships = p.ships;
	}

	getCell(x, y) {
		let sz = this.mapSize;
		let n = x * sz + y;
		if (n < 0) throw ('Не верно заданы параметры x:' + x + ', y:' + y + '  n<0!! n==' + n);
		if (n > (sz * sz)) throw ('Не верно заданы параметры x:' + x + ', y:' + y + '  n>(' + (sz * sz) + ')!! n==' + n);
		let cell = this.map[n];
		if (!x || !y || !cell) {
			console.log('map.length==' + this.map.length);
			throw ('Не верно заданы параметры x:' + x + ', y:' + y + '! n==' + n);
		}
		return cell;
	}

	setDamageToCell(x, y) {
		let cell = this.getCell(x, y);
		cell.setDamaged(1);
		return cell;
	}

	setMarkToCell(x, y) {
		let cell = this.getCell(x, y);
		cell.setMarked(1);
		return cell;
	}

	getShipsInfo() {
		return this.ships.getShipsInfo();
	}
	onShipDamage(ship) {
		this.emit('changeShips', this.getShipsInfo());
	}

	onShipDestroy(ship) {
		let d = this.getShipsInfo();
		this.emit('changeShips', d);
		if (d.cntSafeShips == 0) this.emit('allShipsDestroyed', d);
	}

	endUpdateCells() {
		this.emit('changeCells', this.getMapCells());
	}
}

// управляет действиями на карте attackMap
//   возможно для расчетов нужна будет карта с которой будут вестись атаки (playerMap)
export class GamePlayer extends eventemitter3 {
	constructor(attackMap, playerMap) {
		super();
		if (!attackMap || !playerMap) {
			console.log('карты игроков attackMap||playerMap не заданы!');
			return;
		}
		this.attackMap = attackMap;
		this.playerMap = playerMap;

		let mapSize = attackMap.getMapSize();
		if (mapSize < 10) throw ('Размер карты не может быть меньше 10 ячеек');
		let map = [];
		for (let i = 0; i < mapSize; i++) {
			map[i] = [];
			for (let j = 0; j < mapSize; j++) {
				map[i][j] = 0;  // 0 - неизвестна; 1 - соседние ячейки заняты; 2 - уже простреляна
			}
		}
		this.map = map;
		this.lastShipFoundCells = 0;
	}

	//сохраняем инфо о том куда стреляли и обновляем данные соседних ячеек если попали
	updateAttackedCellInfo(cell) {
		let { x, y } = cell;
		let map = this.map;
		map[x][y] = 2;
		if (cell.ship) { // если попали в корабль то полюбому угловые ячейки не заняты
			// выставляем на них маркер что бы туда больше не палить
			let attackMap = this.attackMap;
			let mapSize = this.attackMap.getMapSize();

			function setMarkToCell(x, y) {
				if (x < 0 || y < 0 || x >= mapSize || y >= mapSize) return;
				if (map[x][y] > 0) return; // если уже есть метка или попадание
				map[x][y] = 1;
				attackMap.setMarkToCell(x, y);
			}

			setMarkToCell(x - 1, y - 1);
			setMarkToCell(x - 1, y + 1);
			setMarkToCell(x + 1, y - 1);
			setMarkToCell(x + 1, y + 1);

			if (cell.ship.isDestroyed()) { // если корабль уничтожен
				// то помечаем все соседние клетки что бы по ним больше не стреляли
				let ship = cell.ship;
				let hv = ship.getPosition();
				let sz = ship.getSize();
				let { x, y } = ship.getLocation();
				for (let i = 0; i < sz; i++) {
					if (hv == 1) { // горизонтальный корабль
						if (i == 0) setMarkToCell(x - 1, y);
						if (i == (sz - 1)) setMarkToCell(x + 1, y);
						setMarkToCell(x, y + 1);
						setMarkToCell(x, y - 1);
						x += 1;
					} else { // вертикальный корабль
						if (i == 0) setMarkToCell(x, y - 1);
						if (i == (sz - 1)) setMarkToCell(x, y + 1);
						setMarkToCell(x + 1, y);
						setMarkToCell(x - 1, y);
						y += 1;
					}
				}

				this.lastShipFoundCells = 0;
				this.attackMap.onShipDestroy(cell.ship);
			} else {
				if (!this.lastShipFoundCells) this.lastShipFoundCells = [];
				this.lastShipFoundCells.push({ x, y });
				this.attackMap.onShipDamage(cell.ship);
			}
		}
		this.attackMap.endUpdateCells();
	}

	// отправляем атаку на клетку x,y
	sendAttack(x, y) {
		let cell = this.attackMap.getCell(x, y);
		if (cell.isDamaged() || cell.isMarked()) return;
		cell.setDamaged(1);
		this.updateAttackedCellInfo(cell);

		let success = !!cell.ship; // если попал по кораблю то success === true
		this.emit('endAttack', success);
	}

	// расчитывает следующую позицию клетки противника для атаки
	getAttackPos() {
		let cells = this.lastShipFoundCells;
		// если ещё не попадали по кораблю
		if (!cells) return this.getRandomNotAttackedXY();

		// если прошлый раз было одно попадание
		if (cells.length == 1) {
			let { x, y } = cells[0];
			// выбираем все соседние квадраты где может ещё находиться корабль
			let arr = [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }];
			return this.getRandomNotAttackedArrPos(arr);
		}

		// если прошлый раз было более одного попадания
		//if(cells.length > 1)
		{
			let pos1 = cells[0];
			// выбираем в каком направлении можно дальше палить вертикально или горизонтально
			let pos2 = cells[cells.length - 1];
			let arr = [];
			if (pos1.y == pos2.y) { // горизонтальный корабль
				let maxx = pos1.x;
				let minx = pos1.x;
				cells.forEach(p => {
					if (p.x < minx) minx = p.x;
					if (p.x > maxx) maxx = p.x;
				});
				let y = pos1.y;
				arr = [{ x: minx - 1, y }, { x: maxx + 1, y }];
			} else { // вертикальный корабль
				let maxy = pos1.y;
				let miny = pos1.y;
				cells.forEach(p => {
					if (p.y < miny) miny = p.y;
					if (p.y > maxy) maxy = p.y;
				});
				let x = pos1.x;
				arr = [{ x, y: miny - 1 }, { x, y: maxy + 1 }];
			}
			return this.getRandomNotAttackedArrPos(arr);
		}
	}

	// выбирает случайную позицию на карте в которой может быть корабль
	getRandomNotAttackedXY() {
		let mapSize = this.attackMap.getMapSize();
		let map = this.map;
		let cnt = 10000;
		while (cnt-- > 0) {
			let x = getRandomInt(0, mapSize - 1);
			let y = getRandomInt(0, mapSize - 1);
			if (map[x][y] == 0) return { x, y };
		}
		return 0;
	}

	// выбирает случайную позицию на карте из набора поинтов arr
	getRandomNotAttackedArrPos(arr) {
		let mapSize = this.attackMap.getMapSize();
		let map = this.map;
		let arr2 = [];
		// сначала выбираем все действительные точки и точки куда ещё не стреляли
		for (let i = 0; i < arr.length; i++) {
			let { x, y } = arr[i];
			if (x < 0 || y < 0 || x >= mapSize || y >= mapSize) continue;
			if (map[x][y] != 0) continue;
			arr2.push(arr[i]);
		}
		if (arr2.length == 0) {
			console.log('невозможно выбрать точку из набора: ');
			console.log(arr);
			return 0;
		}
		// и из всех возможных точек выбираем одну случайную
		let i = getRandomInt(0, arr2.length);
		return arr2[i];
	}
}


export class GamePlay extends eventemitter3 {
	constructor(userMap, enemyMap) {
		super();
		if (!userMap || !enemyMap) {
			console.log('карты игроков userMap||enemyMap не заданы!');
			return;
		}
		this.user = new GamePlayer(enemyMap, userMap);
		this.enemy = new GamePlayer(userMap, enemyMap);

		this.user.on('endAttack', (success) => this.endAttackUser(success));
		this.enemy.on('endAttack', (success) => this.endAttackEnemy(success));

		enemyMap.on('allShipsDestroyed', () => this.userWin());
		userMap.on('allShipsDestroyed', () => this.enemyWin());


		this.turn = getRandomInt(1, 2);  // 1 - user, 2 - enemy
	}

	getTurn() { return this.turn; }
	getTurnName() {
		if (this.turn == 1) return 'твой ход';
		return 'ход противника';
	}

	startGame() {
		if (this.turn == 1) return this.startTurnUser();
		if (this.turn == 2) return this.startTurnEnemy();
	}

	startTurnEnemy() {
		this.turn = 2;
		this.emit('startTurn', this.turn);
		//let pthis = this;
		setTimeout(() => {
			let pos = this.enemy.getAttackPos();
			this.enemy.sendAttack(pos.x, pos.y);
		}, 300);
	}
	endAttackEnemy(success) {
		if (success) return this.startTurnEnemy();
		this.endTurnEnemy();
	}
	endTurnEnemy() {
		this.emit('endTurn', this.turn);
		this.startTurnUser();
	}
	enemyWin() {
		let d = { winner: 2 };
		this.emit('win', d);
	}

	startTurnUser() {
		this.turn = 1;
		this.emit('startTurn', this.turn);
		this.emit('userTurn');
	}
	endAttackUser(success) {
		if (success) return this.startTurnUser();
		this.endTurnUser();
	}
	endTurnUser() {
		this.emit('endTurn', this.turn);
		this.startTurnEnemy();
	}
	userAttack(x, y) {
		if (this.turn == 1) {
			this.user.sendAttack(x, y);
		} else {
			this.emit('message', 'ты не можешь атаковать, дождись своего хода!');
		}
	}
	userWin() {
		let d = { winner: 1 };
		this.emit('win', d);
	}
}
