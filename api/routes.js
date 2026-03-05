import express from "express";
import { apiKeyMiddleware } from "./auth.js";

import { sendMsg } from "../discord/messageService.js";
import { createMessage } from "../discord/embeds.js";
import {
	validateStatusField,
	updateStatusField,
	bulkUpdateStatus,
} from "../discord/statusService.js";

export function createRouter() {
	const app = express();
	app.use(express.json());

	app.get("/", (_, res) => {
		console.log("Got an API req at path '/'");
		res.send("API is up");
	});

	// Send message
	app.post("/message/send", apiKeyMiddleware, async (req, res) => {
		const { content } = req.body;
		console.log("Got an API req at path '/message/send'");
		console.log(`With content: ${content}`);

		// Validation
		if (!content) {
			return res.status(400).json({ error: "Content is required" });
		}

		// Send a message
		try {
			await sendMsg(content);
			return res.status(200).json({ message: "Message sent successfully" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error" });
		}
	});

	// Update status
	app.post("/status/update", apiKeyMiddleware, async (req, res) => {
		const { field, value } = req.body;
		console.log("Got an API req at path '/status'");
		console.log(`With fields: ${field} : ${value} `);

		// Validation
		// Value has to be check like that because js treats 0 as false
		if (!field || value === undefined || value === null) {
			return res.status(400).json({ error: "Field and value are required" });
		}
		if (!validateStatusField(field)) {
			return res.status(400).json({ error: "Field is invalid" });
		}

		// Apply the status
		try {
			await updateStatusField(field, value);
			return res.status(200).json({ message: "Status updates successfully" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error" });
		}
	});

	app.post("/status/bulk-update", apiKeyMiddleware, (req, res) => {
		const { data } = req.body;

		// Validation
		if (!data) {
			return res.status(400).json({ error: "data is required" });
		}

		// Apply the data
		try {
			bulkUpdateStatus(data);
			return res.status(200).json({ message: "Status updates successfully" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error" });
		}
	});

	return app;
}
