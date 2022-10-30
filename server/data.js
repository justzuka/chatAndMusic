users = [];

const addUser = ({ id, name, room }) => {
	users.push({ id, name, room });
};

const removeUser = ({ id }) => {
	users = users.filter((user) => user.id !== id);
};

const getRoomUsers = ({ room }) => {
	return users.filter((user) => user.room === room);
};

const getUser = ({ id }) => {
	return users.find((user) => user.id === id);
};

module.exports = { addUser, removeUser, getRoomUsers, getUser };
