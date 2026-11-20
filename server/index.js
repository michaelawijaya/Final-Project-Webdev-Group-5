const express = require("express");
const app = express();
const port = 3000;

const reports = require("../mock-data/reports.json");
const categories = require("../mock-data/categories.json");
const locations = require("../mock-data/locations.json");

const max_limit = 50;

class BadRequest extends Error {}
/*
BadRequest is needed instead of simply throwing Error to know if the error came specfically from the request
*/

function getQueryValue(query, key) {
    const value = query[key];
    if (value === undefined) return undefined;
    if (typeof value !== "string")
        throw new BadRequest(`${key} must be a single value`);
    return value;
}

/*
getQueryValue():
1. query is equal to the query object { type: "LOST", page: "2" }
2. query[key] effectively means query["type"] for example
3. checks if value is anything but string like undefined or an array (has more than one value such as when given type=LOST&type=FOUND)
4. if everything's fine, the value of the query's param gets returned
*/

function parsePositiveInt(query, key) {
    const value = getQueryValue(query, key);
    if (value === undefined) return undefined;
    if (!/^[1-9]\d*$/.test(value))
        throw new BadRequest(`${key} must be a positive integer`);
    return Number(value);
}

/*
parsePositiveInt():
Pretty much does the same check for getQueryValue() but for integers
It returns the param's value as integers
*/

function parseDate(query, key) {
    const value = getQueryValue(query, key);
    if (value === undefined) return undefined;
    const d = new Date(`${value}T00:00:00.000Z`);

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        Number.isNaN(d.getTime()) ||
        d.toISOString().slice(0, 10) !== value
    ) {
        throw new BadRequest(
            `${key} must be a valid date in YYYY-MM-DD format`,
        );
    }
    return d;
}

/*
parseDate():
It does what it says
*/

function toListItem(r) {
    return {
        id: r.id,
        type: r.type,
        itemName: r.itemName,
        description: r.description,
        category: { id: r.categoryId, name: categories[r.categoryId] ?? null },
        location: { id: r.locationId, name: locations[r.locationId] ?? null },
        locationDetail: r.locationDetail ?? null,
        incidentDate: r.incidentDate,
        imageUrl: r.imagePath ?? null,
        createdAt: r.createdAt,
    };
}

app.get("/api/results/:id", (req, res) => {
    const { id } = req.params;
    let result = {};
    for (i of reports) {
        if (i.id == id) {
            result = i;
        }
    }
    console.log(result);
    if (!result || Object.keys(result).length === 0) {
        return res.status(404).json({ error: "Item not found" });
    }
    res.send(result);
});

app.get("/api/results", (req, res) => {
    let filters;
    try {
        const type = getQueryValue(req.query, "type");
        if (type !== undefined && type !== "LOST" && type !== "FOUND") {
            throw new BadRequest("type must be LOST or FOUND");
        }
        // handles the type param, make sure it's between the two values

        const dateFrom = parseDate(req.query, "dateFrom");
        const dateTo = parseDate(req.query, "dateTo");
        if (dateFrom && dateTo && dateTo < dateFrom) {
            throw new BadRequest("dateTo must not be earlier than dateFrom");
        }
        // handles the date params, make sure they're inputted appropriate values

        filters = {
            type,
            categoryId: parsePositiveInt(req.query, "categoryId"),
            locationId: parsePositiveInt(req.query, "locationId"),
            dateFrom,
            dateTo,
            page: parsePositiveInt(req.query, "page") ?? 1,
            limit: Math.min(
                parsePositiveInt(req.query, "limit") ?? 20,
                max_limit,
            ),
        };
    } catch (err) {
        if (err instanceof BadRequest)
            return res.status(400).json({ error: err.message });
        throw err;
    }

    const { type, categoryId, locationId, dateFrom, dateTo, page, limit } =
        filters;

    const dateToExclusive =
        dateTo && new Date(dateTo.getTime() + 24 * 60 * 60 * 1000);

    const filtered = reports.filter((r) => {
        const incident = new Date(r.incidentDate);
        return (
            (!type || r.type === type) &&
            (!categoryId || r.categoryId === categoryId) &&
            (!locationId || r.locationId === locationId) &&
            (!dateFrom || incident >= dateFrom) &&
            (!dateToExclusive || incident < dateToExclusive)
        );
    });
    // filters matching reports

    filtered.sort((a, b) => {
        const diff = new Date(b.createdAt) - new Date(a.createdAt);
        return diff !== 0 ? diff : b.id - a.id;
    });
    // sorts the reports based on date

    const total = filtered.length;
    const data = filtered
        .slice((page - 1) * limit, page * limit)
        .map(toListItem);

    res.json({
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});

app.listen(port, () => {
    console.log("Listening");
});
