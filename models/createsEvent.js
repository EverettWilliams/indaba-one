// Database functions most closely related to the Creates_Event table

var	dbcon = 	require('../config/dbcon.js'),
	sql =   	require('mysql2/promise');

// Create a row in the Creates_Event table with the given information
module.exports.createCreatesEvent = async function(eventId, user_id) {
	try {
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"INSERT INTO `creates_event` " +
		"(`fk_event_id`, `fk_user_id`) VALUES (?, ?);",
		[eventId, user_id]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};

// Get name and event id for all events a user has created with an expiration date
// of yesterday or later. Also returns events with a NULL expiration date.
module.exports.getUpcomingUserEvents = async function(user_id) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT e.event_name, e.event_id, ce.fk_user_id AS organizer " +
		"FROM `event` e " +
		"INNER JOIN `creates_event` ce ON e.event_id = ce.fk_event_id " +
		"WHERE ce.fk_user_id = ? AND (e.expiration_date >= CURDATE() - INTERVAL 1 DAY " +
		"OR e.expiration_date IS NULL);",
		[user_id]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Get event id for all events a user has created with an expiration date
// of yesterday or earlier
module.exports.getPastUserEvents = async function(user_id) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT e.event_id " +
		"FROM `event` e " +
		"INNER JOIN `creates_event` ce ON e.event_id = ce.fk_event_id " +
		"WHERE ce.fk_user_id = ? AND e.expiration_date < CURDATE() - INTERVAL 1 DAY;",
		[user_id]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Get all organizers for a given event
module.exports.getEventOrganizers = async function(eventId) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT ce.fk_user_id AS organizer " +
		"FROM `creates_event` ce " +
		"WHERE ce.fk_event_id = ?;", [eventId]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Removes user from creates event table.
module.exports.removeUserFromCreatesEvent = async function(eventId) {
	try{
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"DELETE FROM `creates_event` " +
		"WHERE `fk_event_id` = ?;",
		 [eventId]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};
