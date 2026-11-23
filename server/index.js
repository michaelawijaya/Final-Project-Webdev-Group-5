const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const multer = require("multer");
const express = require("express");
const app = express();
const port = 3000;

const reports = require("../mock-data/reports.json");
const categories = Object.fromEntries(
    require("../mock-data/categories.json").map((c) => [c.id, c.name]),
);
const locations = Object.fromEntries(
    require("../mock-data/locations.json").map((l) => [l.id, l.name]),
);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
class BadRequest extends HttpError {
  constructor(message) { super(400, message); }
}
class NotFound extends HttpError {
  constructor(message = "Not found") { super(404, message); }
}

// Forwards rejected promises to the error middleware (needed on Express 4, harmless on 5)
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
/*
BadRequest is needed instead of simply throwing Error to know that the error came specfically from the request
*/

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const MAX_LIMIT = 50;
const EXPIRY_DAYS = 30;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const CONTACT_METHODS = ["LINE", "PHONE", "WHATSAPP", "EMAIL", "DISCORD"];
const UPLOAD_DIR = path.join(__dirname, "uploads");

function getSingle(query, key) {
    const value = query[key];
    if (value === undefined) return undefined;
    if (typeof value !== "string")
        throw new BadRequest(`${key} must be a single value`);
    return value;
}

/*
getSingle():
1. query is equal to the query object { type: "LOST", page: "2" }
2. query[key] effectively means query["type"] for example
3. checks if value is anything but string like undefined or an array (has more than one value such as when given type=LOST&type=FOUND)
4. if everything's fine, the value of the query's param gets returned
*/

function parsePositiveInt(query, key) {
    const value = getSingle(query, key);
    if (value === undefined) return undefined;
    if (!/^[1-9]\d*$/.test(value))
        throw new BadRequest(`${key} must be a positive integer`);
    return Number(value);
}

/*
parsePositiveInt():
Pretty much does the same check for getSingle() but for integers
It returns the param's value as integers
*/

function parseDate(query, key) {
    const value = getSingle(query, key);
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
/*
toListItem():
It lists the fields that will be returned for get /reports
*/

function isPubliclyVisible(r) {
  return r.status === "OPEN" && new Date(r.expiresAt) > new Date();
}
/*
isPubliclyVisible():
Checks if a report's status is open and it's not yet expired
*/

function toDetail(r) {
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
        reporterName: r.reporterName,
        contactMethod: r.contactMethod,
        contactValue: r.contactValue,
    };
}
/*
toDetail():
Returns the fields for get /results/:id
It's the same as toListItem() but has reporterName and contactMethod and no createdAt fields
*/

// Memory storage: nothing touches disk until every field has passed validation
const uploadPhoto = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_PHOTO_BYTES, files: 1 },
}).single("photo");

// Turns multer's own errors (too large, wrong field name) into 400s
function handleUpload(req, res, next) {
  uploadPhoto(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const msg = err.code === "LIMIT_FILE_SIZE" ? "photo must be 5 MB or smaller" : "invalid file upload";
      return next(new BadRequest(msg)); // was: res.status(400).json(...)
    }
    next(err); // undefined when there's no error
  });
}

function parseString(body, key, { required = false, max }) {
    const v = getSingle(body, key)?.trim();
    if (!v) {
        if (required) throw new BadRequest(`${key} is required`);
        return null;
    }
    if (v.length > max)
        throw new BadRequest(`${key} must be at most ${max} characters`);
    return v;
}

function parseEnum(body, key, allowed) {
    const v = getSingle(body, key);
    if (!allowed.includes(v))
        throw new BadRequest(`${key} must be one of: ${allowed.join(", ")}`);
    return v;
}

function requirePresent(value, key) {
    if (value === undefined) throw new BadRequest(`${key} is required`);
    return value;
}

// The client-declared Content-Type can be faked, so check the file's actual first bytes
function detectImageExt(buf) {
    if (
        buf.length >= 3 &&
        buf[0] === 0xff &&
        buf[1] === 0xd8 &&
        buf[2] === 0xff
    )
        return "jpg";
    if (
        buf.length >= 8 &&
        buf
            .subarray(0, 8)
            .equals(
                Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
            )
    )
        return "png";
    if (
        buf.length >= 12 &&
        buf.toString("ascii", 0, 4) === "RIFF" &&
        buf.toString("ascii", 8, 12) === "WEBP"
    )
        return "webp";
    return null;
}

function toCreated(r) {
    return {
        ...toDetail(r), // id, type, itemName, ..., reporterName, contactMethod
        contactValue: r.contactValue,
        status: r.status,
        createdAt: r.createdAt,
        expiresAt: r.expiresAt,
    };
}

app.post("/api/results", handleUpload, async (req, res, next) => {
    try {
        const body = req.body ?? {};

        const type = parseEnum(body, "type", ["LOST", "FOUND"]);
        const itemName = parseString(body, "itemName", {
            required: true,
            max: 100,
        });
        const description = parseString(body, "description", {
            required: true,
            max: 1000,
        });

        const categoryId = requirePresent(
            parsePositiveInt(body, "categoryId"),
            "categoryId",
        );
        if (categories[categoryId] === undefined)
            throw new BadRequest(
                "categoryId does not reference an existing category",
            );

        const locationId = requirePresent(
            parsePositiveInt(body, "locationId"),
            "locationId",
        );
        if (locations[locationId] === undefined)
            throw new BadRequest(
                "locationId does not reference an existing location",
            );

        const locationDetail = parseString(body, "locationDetail", {
            max: 255,
        });

        const incidentDate = requirePresent(
            parseDate(body, "incidentDate"),
            "incidentDate",
        );
        // "Today" in Jakarta time, so a user after 17:00 UTC isn't wrongly told their date is in the future
        const todayJakarta = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Jakarta",
        });
        if (incidentDate.toISOString().slice(0, 10) > todayJakarta) {
            throw new BadRequest("incidentDate must not be in the future");
        }

        const reporterName = parseString(body, "reporterName", {
            required: true,
            max: 100,
        });
        const contactMethod = parseEnum(body, "contactMethod", CONTACT_METHODS);
        const contactValue = parseString(body, "contactValue", {
            required: true,
            max: 100,
        });

        let photoExt = null;
        if (req.file) {
            photoExt = detectImageExt(req.file.buffer);
            if (!photoExt)
                throw new BadRequest("photo must be a JPEG, PNG or WebP image");
        }

        // ---- everything below runs only after all validation passed ----

        let imagePath = null;
        if (photoExt) {
            const filename = `${crypto.randomUUID()}.${photoExt}`;
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
            await fs.writeFile(
                path.join(UPLOAD_DIR, filename),
                req.file.buffer,
            );
            imagePath = `/uploads/${filename}`;
        }

        const manageToken = crypto.randomBytes(32).toString("base64url"); // 43 characters
        const manageTokenHash = crypto
            .createHash("sha256")
            .update(manageToken)
            .digest("hex");

        const now = new Date();
        const record = {
            id: Math.max(0, ...reports.map((r) => r.id)) + 1, // Prisma autoincrement replaces this
            type,
            itemName,
            description,
            categoryId,
            locationId,
            locationDetail,
            incidentDate: incidentDate.toISOString(),
            imagePath,
            reporterName,
            contactMethod,
            contactValue,
            createdAt: now.toISOString(),
            status: "OPEN",
            expiresAt: new Date(
                now.getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
            ).toISOString(),
            manageTokenHash,
        };
        reports.push(record); // in memory only: resets when the server restarts

        res.status(201)
            .set("Cache-Control", "no-store")
            .json({ report: toCreated(record), manageToken });
    } catch (err) {
        if (err instanceof BadRequest)
            return res.status(400).json({ error: err.message });
        next(err);
    }
});

app.get("/api/results/:id", (req, res) => {
    let id;
    try {
        id = parsePositiveInt(req.params, "id");
    } catch (err) {
        if (err instanceof BadRequest)
            return res.status(400).json({ error: err.message });
        throw err;
    }

    const report = reports.find((r) => r.id === id);

    // Same 404 for "doesn't exist" and "not visible", so hidden reports can't be probed
    if (!report || !isPubliclyVisible(report)) {
        return res.status(404).json({ error: "Report not found" });
    }

    res.json(toDetail(report));
});

app.get("/api/results", (req, res) => {
    let filters;
    try {
        const type = getSingle(req.query, "type");
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
                MAX_LIMIT,
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
