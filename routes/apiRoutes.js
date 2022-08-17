const fs = require("fs");

const router = require("express").Router();
// Helper method for generating unique ids
const uuid = require("../helpers/uuid");

const { notes } = require("../data/db");

router.get("/notes", (req, res) => {
	let results = notes;

	res.json(results);
});

//POST request to add a note
router.post("/notes", (req, res) => {
	// Log that a POST request was received
	console.log(`${req.method} request received to add a note`);
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
		const jsonArray = require("../data/db"); //added a note
		console.log(JSON.stringify(jsonArray));

		jsonArray["notes"].push(newNote); //pushed to array
		const noteString = JSON.stringify(jsonArray); //changed to pass the array through

		// Write the string to a file
		fs.writeFileSync(`./data/db.json`, noteString, (err) =>
			err
				? console.error(err)
				: console.log(`note for ${newNote.title} has been written to JSON file`)
		);

		const response = {
			status: "success",
			body: newNote,
		};

		console.log("test", response);
		res.json(response);
	} else {
		res.json("Error in posting new note");
	}
});

// router.delete("/notes/:id", (req, res) => {

// })

module.exports = router;
