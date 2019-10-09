import { writable } from 'svelte/store';
import { fetchJSON } from '../fnc.js';
//import { sessStore } from '../sess/sessStore.js';

let userStore = {
    name: '',
}
const { subscribe, set } = writable(userStore);

userStore.name = window.localStorage.getItem('user');
userStore.setName = function(name) {
	userStore.name = name;
	window.localStorage.setItem('user', name);
	set(userStore);
	return this;
}

function createUserStore() {
	return { subscribe };
}
export const user = createUserStore();
