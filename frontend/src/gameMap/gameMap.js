
function getRandomInt(min,max) {
  return min + Math.floor(Math.random() * Math.floor(max));
}

class MapCell {
	constructor({x,y},ship=0,damaged=0){
		this.ship = ship; // 0 - none; 1 - user; 2 - pc;
		this.damaged = damaged; // 0 - не тронутая, 1 - уже попали по этой точке
		this.x = x;
		this.y = y;
	}

	setShip(ship){ this.ship = ship; }
	setDamaged(d){ this.damaged = d; }
	getShip() { return this.ship; }
}

// PlayerShip отвечает за разворот и размер корабля и состояние
class PlayerShip {
	constructor(playerShipId,size,position=0){
		this.location = {x:-1,y:-1};
		this.playerShipId = playerShipId;
		this.size = size;
		this.position = position;  // 1 - horizontal, 2 - vertical, 0 - random
		if(position==0) this.position = Math.round(1+Math.random());
		this.cntSafeCells = size;
		this.cells = [];
		if(size>4) throw('Размер корабля не может быть больше 4 ячеек');
		if(size<1) throw('Размер корабля не может быть меньше 1 ячееки');
	}

	getPosition() {return this.position;}
	getSize() {return this.size;}
	getCntSafeCells() {return this.cntSafeCells;}
	getCells() {return this.cells;}


	addCell(cell){ 
		cell.setShip(this);
		this.cells.push(cell);
	}
	setToCells(cells){
		this.cells = cells;
		for(let i in cells){
			let cell = cells[i];
			cell.setShip(this.playerShipId);
		}
	}

	setLocation({x,y}){ this.location = {x:x,y:y};}
	getLocation() {return this.location; }
}

// PlayerShips следит за кораблями игрока
class PlayerShips {
	constructor(mapSize){
		
		this.ships = {};
		let id = 20;
		this.ships[id] = new PlayerShip(id++,4);
		this.ships[id] = new PlayerShip(id++,3);
		this.ships[id] = new PlayerShip(id++,3);
		this.ships[id] = new PlayerShip(id++,2);
		this.ships[id] = new PlayerShip(id++,2);
		this.ships[id] = new PlayerShip(id++,2);
		this.ships[id] = new PlayerShip(id++,1);
		this.ships[id] = new PlayerShip(id++,1);
		this.ships[id] = new PlayerShip(id++,1);
		this.ships[id] = new PlayerShip(id++,1);
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

		for(let i in this.ships) {
			let ship = this.ships[i];
			this.setShipToRandomFreeMap(ship);
		}
	}

	// возврващает 0 или корабль по координатам x,y
	getCellShip({x,y}) {
		let id = this.freeMap[x][y];
		if(id < 10) return 0;
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
		if(hv==1) needmapsizeH -= sz;
		else needmapsizeV -= sz;
		
		// выбираем случайные ячейки для первой ячейки корабля из возможной обсласти
		let posH = getRandomInt(0,needmapsizeH);
		let posV = getRandomInt(0,needmapsizeV);
		
		// определяем не заняты ли ячейки для остальных ячеек корабля
		for(let i = 0; i < sz; i++){
			let b = 0
			if(hv==1) {
				b = map[posH+i][posV];
			}else{
				b = map[posH][posV+i];
			}
			if(b!=0){ // если ячейка уже занята (или занята соседняя ячейка)
				//пробуем вычислить следующее случайное положение
				return this.setShipToRandomFreeMap(ship);
			}
		}

		//если корабль можно установить то 
		// ставим отметки на карте что эти и соседние ячейки уже заняты
		for(let i = 0; i < sz; i++){
			let iposH = posH;
			let iposV = posV;
			if(hv==1) iposH += i;
			else iposV += i;
			this.setCellShipped(ship,iposH,iposV);
		}

		ship.setLocation({x:posH,y:posV});
	}

	//задаем что эта ячейка уже занята кораблем(id) и соседние ячейки тоже(1)
	setCellShipped(ship,x,y){
		let sz = this.freemapSize;
		let map = this.freeMap;
		map[x][y] = ship.playerShipId;
		if(x>0){
			if(map[x-1][y]==0) map[x-1][y] = 1;
			if(y+1<sz && map[x-1][y+1]==0) map[x-1][y+1] = 1;
		}
		if(y>0){
			if(map[x][y-1]==0) map[x][y-1] = 1;
			if(x+1<sz && map[x+1][y-1]==0) map[x+1][y-1] = 1;
			if(x>0 && map[x-1][y-1]==0) map[x-1][y-1] = 1;
		}
		if(x+1<sz){
			if(map[x+1][y]==0) map[x+1][y] = 1;
		}
		if(y+1<sz){
			if(map[x][y+1]==0) map[x][y+1] = 1;
			if(x+1<sz && map[x+1][y+1]==0) map[x+1][y+1] = 1;
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
				s += '  '+String(b).padStart(3,' ');
			}
			s += '\n';
		}
		return s;
	}
}

//PlayerMap хранит и отвечает за ячйки карты одного из игроков
export class PlayerMap {
	constructor(mapSize){
		if(mapSize<10) throw('Размер карты не может быть меньше 10 ячеек');
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
				let cell = new MapCell({x:i,y:j});
				map.push(cell);
				let ship = ships.getCellShip({x:i,y:j});
				if(ship){ ship.addCell(cell); }
			}
		}
		this.map = map;
	}

	getMapSize() { return this.mapSize; }
	getFreeMapStr() { return this.ships.getFreeMapStr(); }


	getMapCells(){
		let map = this.map;
		return map;
	}

	getMapData() {return this;}
	setMapData(p){
		this.map = p.map;
		this.mapSize = p.mapSize;
		this.ships = p.ships;
	}

	setDamageToCell(x,y) {
		let sz = this.mapSize;
		let n = x*sz + y;
		if(n<0) throw('Не верно заданы параметры x:'+x+', y:'+y+'  n<0!! n=='+n);
		if(n>(sz*sz)) throw('Не верно заданы параметры x:'+x+', y:'+y+'  n>('+(sz*sz)+')!! n=='+n);
		let cell = this.map[n];
		cell.setDamaged(1);
		console.log('setDamageToCell('+x+','+y+')');
	}
}

// управляет действиями на карте attackMap
//   возможно для расчетов нужна будет карта с которой будут вестись атаки (playerMap)
export class Attack {
	constructor(attackMap,playerMap){
		if(!attackMap || !playerMap){
			console.log('карты игроков attackMap||playerMap не заданы!');
			return;
		}
		this.attackMap = attackMap;
		this.playerMap = playerMap;
		
		let mapSize = attackMap.getMapSize();
		if(mapSize<10) throw('Размер карты не может быть меньше 10 ячеек');
		let map = [];
		for (let i = 0; i < mapSize; i++) {
			map[i] = [];
			for (let j = 0; j < mapSize; j++) {
				map[i][j] = 0;  // 0 - свободна; 1 - соседние ячейки заняты; 2 - занята
			}
		}
		this.map = map;
		this.mapSize = mapSize;
	}

	sendAttack(x,y){
		let map = this.attackMap;
		map.setDamageToCell(x,y);
	}

}

//export const PlayerMap = PlayerMap;
