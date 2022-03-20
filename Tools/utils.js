import moment from 'moment';

function getStart(date, type) {
	const m = moment(date);
	return m.startOf(type).unix();
}

function getEnd(date, type) {
	const m = moment(date);
	return m.endOf(type).unix();
}

function getInitRange() {
	return getRange('month');
}

const conv = { day: 'days', week: 'weeks', month: 'months', year: 'years' };
function incrementRange(range) {
	return crementRange(range, 'add');
}

function decrementRange(range) {
	return crementRange(range, 'subtract');
}

function crementRange(range, fun) {
	const { from, to, type } = range;

	const _from = moment(from * 1000);
	const _to = moment(to * 1000);

	return {
		type,
		from: _from[fun](1, conv[type]).startOf(type).unix(),
		to: _to[fun](1, conv[type]).endOf(type).unix(),
	};
}

function getRange(type) {
	return {
		from: moment().startOf(type).unix(),
		to: moment().endOf(type).unix(),
		type: type,
	};
}

function formatDate(date) {
	date = new Date(date);
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return `${date.getDate()} ${months[date.getMonth()].toUpperCase()} ${date.getFullYear()}`;
}

function getDateString(date) {
	return moment(date).format('DD MMM YYYY').toUpperCase();
}

function isSameDay(from, to) {
	return moment(from).isSame(to, 'day');
}

export { getStart, getEnd, getInitRange, getRange, incrementRange, decrementRange, formatDate, getDateString, isSameDay };
