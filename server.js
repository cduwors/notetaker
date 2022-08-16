const express = require("express");
const fs = require("fs");
const path = require("path");
// Helper method for generating unique ids
const uuid = require("./helpers/uuid");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const { notes } = require("./data/db");

function filterByQuery(query, jsonArray) {
	let filteredResults = jsonArray;
	if (query.id) {
		filteredResults = filteredResults.filter((notes) => notes.id === query.id);
	}
	return filteredResults;
}


app.get("/api/notes", (req, res) => {
	let results = notes;
	if (req.query) {
		results = filterByQuery(req.query, results);
	}
	console.log(req.query);
	res.json(results);
});

//POST request to add a note
app.post("/api/notes", (req, res) => {
	// Log that a POST request was received
	console.info(`${req.method} request received to add a note`);
	res.send("post to /api/notes success");
	// Destructuring assignment for the items in req.body
	const { title, text } = req.body;

	// If all the required properties are present
	if (title && text) {
		// Variable for the object we will save
		const newNote = {
			title,
			text,
			id: uuid(),
		};

		// Convert the data to a string so we can save it
		const jsonArray = require("./data/db"); //added a note
		console.log(JSON.stringify(jsonArray));

		jsonArray["notes"].push(newNote); //pushed to array
		const noteString = JSON.stringify(jsonArray); //changed to pass the array through

		// Write the string to a file
		fs.writeFile(`./data/db.json`, noteString, (err) =>
			err
				? console.error(err)
				: console.log(`note for ${newNote.title} has been written to JSON file`)
		);

		const response = {
			status: "success",
			body: newNote,
		};

		console.log(response);
		res.json(response);
	} else {
		res.json("Error in posting new note");
	}
});

app.listen(PORT, () => {
	console.log(`API server now on port ${PORT}!`);
});
