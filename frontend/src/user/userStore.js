import { writable } from 'svelte/store';

let userStore = {
    name: '',
    enemy: '',
    mapSize: 10,

    mapUser: 0,
    mapEnemy: 0,
}
userStore.name = window.localStorage.getItem('user');
userStore.enemy = window.localStorage.getItem('enemy');
userStore.mapSize = window.localStorage.getItem('mapSize');
if(!userStore.mapSize || userStore.mapSize<10) userStore.mapSize = 10;

const { subscribe, set } = writable(userStore);

userStore.setName = function(name,enemy) {
	console.log("сохраняем имена");
	userStore.name = name;
	userStore.enemy = enemy;
	window.localStorage.setItem('user', name);
	window.localStorage.setItem('enemy', enemy);
	set(userStore);
	return this;
}
userStore.setMapSize = function(mapSize) {
	if(userStore.mapSize == mapSize) return;
	console.log("сохраняем размер карты");
	userStore.mapSize = mapSize;
	window.localStorage.setItem('mapSize', mapSize);
	set(userStore);
	return this;
}
userStore.setMapData = function(mapUser,mapEnemy){
	console.log("сохраняем данные карты");
	userStore.mapUser = mapUser;
	userStore.mapEnemy = mapEnemy;
	window.localStorage.setItem('mapUser', mapUser);
	window.localStorage.setItem('mapEnemy', mapEnemy);
	set(userStore);
	return this;
}


function createUserStore() {
	return { subscribe };
}
export const userData = createUserStore();
