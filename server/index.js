const express = require("express");
const app = express();
const port = 3000;

const reports = require("../mock-data/reports.json");

app.get("/api/results/:id", (req, res) => {
    const {id} = req.params
    let result = {}
    for (i of reports) {
        if (i.id == id) {
            result = i
        }
    }
    if (result == {}) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.send(result)
});

app.get("/api/results", (req, res) => {
    if (!reports) {
        return res.status(404).json({ error: "Item not found" });
    } else {
        res.json(reports);
    }
});

app.listen(port, () => {
    console.log("Listening");
});
