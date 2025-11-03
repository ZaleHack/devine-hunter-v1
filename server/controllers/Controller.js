const mongoose = require('mongoose');
const { Fqdn } = require("../models/fqdn.model");
const { Url } = require("../models/url.model");
const { Cve } = require("../models/cve.model");
const { Log } = require("../models/log.model");
const { CdrRealtime } = require("../models/cdrRealtime.model");
const { normalizeFqdn, buildFqdnQuery } = require("../utils/fqdn");
const util = require('util');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const execFile = require('child_process').execFile;
const execSync = util.promisify(require('child_process').execSync);
const axios = require('axios');
const https = require('https');

const ensureDatabaseConnection = (res) => {
    if (mongoose.connection.readyState === 1) {
        return true;
    }

    res.status(503).json({
        message: "La base de données MongoDB est indisponible. Veuillez vérifier que le service est démarré.",
    });

    return false;
};

const normalizeIdentifier = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    const stringValue = `${value}`.trim();
    return stringValue || null;
};

const normalizeDateInput = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    const raw = `${value}`.trim();

    if (!raw) {
        return null;
    }

    const sanitized = raw.replace(/[/.]/g, "-");

    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(sanitized)) {
        const [year, month, day] = sanitized.split('-');
        return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    if (/^\d{8}$/.test(raw)) {
        return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
    }

    return null;
};

const normalizeTimeInput = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    if (value instanceof Date) {
        return value.toISOString().slice(11, 19);
    }

    const raw = `${value}`.trim();

    if (!raw) {
        return null;
    }

    if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) {
        return raw;
    }

    if (/^\d{2}:\d{2}$/.test(raw)) {
        const [hours, minutes] = raw.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    }

    if (/^\d{6}$/.test(raw)) {
        return `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4, 6)}`;
    }

    if (/^\d{4}$/.test(raw)) {
        return `${raw.slice(0, 2)}:${raw.slice(2, 4)}:00`;
    }

    return null;
};

const combineDateTime = (datePart, timePart) => {
    if (!datePart && !timePart) {
        return null;
    }

    const safeDate = datePart || '1970-01-01';
    const safeTime = timePart || '00:00:00';
    const isoString = `${safeDate}T${safeTime}Z`;
    const parsed = new Date(isoString);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
};

const updateAggregation = (map, key, recordDate, recordTime, meta = {}) => {
    if (!key) {
        return;
    }

    const combined = combineDateTime(recordDate, recordTime);
    let sortValue = Number.NEGATIVE_INFINITY;
    let isoString = null;

    if (combined) {
        sortValue = combined.getTime();
        isoString = combined.toISOString();
    } else if (recordDate) {
        const fallbackTimestamp = Date.parse(`${recordDate}T${recordTime || '00:00:00'}Z`);

        if (!Number.isNaN(fallbackTimestamp)) {
            sortValue = fallbackTimestamp;
            isoString = new Date(fallbackTimestamp).toISOString();
        }
    }

    if (sortValue === Number.NEGATIVE_INFINITY && !recordDate && !recordTime) {
        return;
    }

    const currentEntry = map.get(key);

    if (!currentEntry || sortValue > currentEntry.sortValue) {
        map.set(key, {
            ...meta,
            sortValue,
            lastUsage: isoString,
            lastUsageDate: recordDate || null,
            lastUsageTime: recordTime || null,
        });
    }
};

module.exports.ping = (req, res) => {
    res.json({ message: "pong" });
}

// CVE Controllers

module.exports.addCve = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Cve.create(req.body)
        .then(newCve=>res.json(newCve))
        .catch(err=>res.status(400).json(err))
}

module.exports.getCves = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Cve.find()
        .then(Cves=>res.json(Cves))
        .catch(err=>res.status(400).json(err))
}

module.exports.deleteCve = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Cve.deleteOne({ cve: req.body.cve })
        .then(result=>res.json({success:true}))
        .catch(err=>res.status(400).json(err))
}

// Fqdn Controllers

module.exports.addFqdn = async (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    const incomingBody = req.body || {};
    const normalizedFqdn = normalizeFqdn(incomingBody.fqdn);

    if (!normalizedFqdn) {
        return res.status(400).json({ message: "Le champ FQDN est requis." });
    }

    try {
        const existingFqdn = await Fqdn.findOne(buildFqdnQuery(normalizedFqdn));

        if (existingFqdn) {
            if (existingFqdn.fqdn !== normalizedFqdn) {
                existingFqdn.fqdn = normalizedFqdn;
                await existingFqdn.save();
            }

            return res.json(existingFqdn);
        }

        const payload = { ...incomingBody, fqdn: normalizedFqdn };
        const newFqdn = await Fqdn.create(payload);
        return res.json(newFqdn);
    } catch (err) {
        console.error('Error adding FQDN:', err);
        return res.status(500).json({ message: "Une erreur est survenue lors de l'ajout du FQDN.", details: err.message });
    }
}

module.exports.getFqdns = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Fqdn.find()
        .then(fqdns=>res.json(fqdns))
        .catch(err=>res.status(400).json(err))
}

module.exports.getFqdn = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Fqdn.findOne({ _id: req.body._id })
        .then(oneFqdn=>res.json(oneFqdn))
        .catch(err=>res.status(400).json(err))
}

module.exports.deleteFqdn = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Fqdn.deleteOne({ _id: req.body._id })
        .then(result=>res.json({success:true}))
        .catch(err=>res.status(400).json(err))
}

module.exports.updateFqdn = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    console.log(req.body)
    Fqdn.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true, runValidators: true })
        .then(result=>res.json(result))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoGetFqdn = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    const normalizedFqdn = normalizeFqdn(req.body && req.body.fqdn);

    if (!normalizedFqdn) {
        return res.status(400).json({ message: "Le champ FQDN est requis." });
    }

    Fqdn.findOne(buildFqdnQuery(normalizedFqdn))
        .then(oneFqdn=>res.json(oneFqdn))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoUpdateFqdn = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    const incomingBody = req.body || {};
    const normalizedFqdn = normalizeFqdn(incomingBody.fqdn);

    if (!normalizedFqdn) {
        return res.status(400).json({ message: "Le champ FQDN est requis." });
    }

    const payload = { ...incomingBody, fqdn: normalizedFqdn };

    Fqdn.findOneAndUpdate(
        buildFqdnQuery(normalizedFqdn),
        payload,
        { new: true, runValidators: true })
        .then(result=>res.json(result))
        .catch(err=>res.status(400).json(err))
}

// Url Controllers

module.exports.addUrl = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Url.create(req.body)
        .then(newUrl=>res.json(newUrl))
        .catch(err=>res.status(400).json(err))
}

module.exports.getUrls = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Url.find()
        .then(urls=>res.json(urls))
        .catch(err=>res.status(400).json(err))
}

module.exports.getUrl = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Url.findOne({ _id: req.body._id })
        .then(oneUrl=>res.json(oneUrl))
        .catch(err=>res.status(400).json(err))
}

module.exports.deleteUrl = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Url.deleteOne({ _id: req.body._id })
        .then(result=>res.json({success:true}))
        .catch(err=>res.status(400).json(err))
}

module.exports.updateUrl = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Url.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true, runValidators: true })
        .then(result=>res.json(result))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoGetUrl = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Url.findOne({ url: req.body.url })
        .then(oneUrl=>res.json(oneUrl))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoUpdateUrl = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Url.findOneAndUpdate(
        { url: req.body.url },
        req.body,
        { new: true, runValidators: true })
        .then(result=>res.json(result))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoDeleteUrl = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Url.deleteOne({ url: req.body.url })
        .then(result=>res.json({success:true}))
        .catch(err=>res.status(400).json(err))
}

module.exports.getUrlList = async (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    const { fqdnId } = req.body || {};

    if (!fqdnId) {
        return res.status(400).json({ message: "fqdnId is required" });
    }

    try {
        const fqdnRecord = await Fqdn.findById(fqdnId).lean();

        if (!fqdnRecord) {
            return res.status(404).json({ message: "FQDN not found" });
        }

        const urlsForFqdn = await Url.find({ fqdn: fqdnRecord.fqdn }).lean();

        const uniqueUrls = new Set();

        const addCandidate = (candidate) => {
            if (typeof candidate !== "string") {
                return;
            }

            const trimmed = candidate.trim();
            if (!trimmed) {
                return;
            }

            uniqueUrls.add(trimmed);
        };

        const addFromCollection = (collection) => {
            if (Array.isArray(collection)) {
                collection.forEach(addCandidate);
            }
        };

        addCandidate(fqdnRecord.fqdn);
        addFromCollection(fqdnRecord.targetUrls);

        const subdomains = fqdnRecord.recon && fqdnRecord.recon.subdomains ? fqdnRecord.recon.subdomains : {};
        addFromCollection(subdomains.httprobe);
        addFromCollection(subdomains.httprobeAdded);
        addFromCollection(subdomains.httprobeRemoved);
        addFromCollection(subdomains.masscan);
        addFromCollection(subdomains.masscanLive);

        urlsForFqdn.forEach((doc) => {
            addCandidate(doc.url);

            if (!Array.isArray(doc.endpoints)) {
                return;
            }

            doc.endpoints.forEach((endpoint) => {
                if (!endpoint || typeof endpoint.endpoint !== "string") {
                    return;
                }

                const baseUrl = typeof doc.url === "string" ? doc.url.trim() : "";

                if (!baseUrl) {
                    return;
                }

                const normalisedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
                const normalisedEndpoint = endpoint.endpoint.startsWith("/") ? endpoint.endpoint : `/${endpoint.endpoint}`;

                addCandidate(`${normalisedBase}${normalisedEndpoint}`);
            });
        });

        return res.json({ eyeWitness: Array.from(uniqueUrls) });
    } catch (error) {
        console.error("Error retrieving URL list:", error);
        return res.status(500).json({ message: "Unable to retrieve URL list" });
    }
}

// Fraud Management Controllers

module.exports.searchFraudRecords = async (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }

    const body = req.body || {};
    const numeroFilter = normalizeIdentifier(body.numero);
    const imeiFilter = normalizeIdentifier(body.imei);

    if (!numeroFilter && !imeiFilter) {
        return res.status(400).json({
            message: "Veuillez renseigner un numéro ou un IMEI pour lancer la recherche.",
        });
    }

    const dateStart = body.dateStart !== undefined ? normalizeDateInput(body.dateStart) : null;
    const dateEnd = body.dateEnd !== undefined ? normalizeDateInput(body.dateEnd) : null;
    const timeStart = body.timeStart !== undefined ? normalizeTimeInput(body.timeStart) : null;
    const timeEnd = body.timeEnd !== undefined ? normalizeTimeInput(body.timeEnd) : null;

    if (body.dateStart && !dateStart) {
        return res.status(400).json({ message: "Le format de la date de début est invalide." });
    }

    if (body.dateEnd && !dateEnd) {
        return res.status(400).json({ message: "Le format de la date de fin est invalide." });
    }

    if (body.timeStart && !timeStart) {
        return res.status(400).json({ message: "Le format de l'heure de début est invalide." });
    }

    if (body.timeEnd && !timeEnd) {
        return res.status(400).json({ message: "Le format de l'heure de fin est invalide." });
    }

    const mongoQuery = {};

    if (numeroFilter) {
        mongoQuery.numero_appelant = numeroFilter;
    }

    if (imeiFilter) {
        mongoQuery.imei_appelant = imeiFilter;
    }

    try {
        const rawRecords = await CdrRealtime.find(mongoQuery).lean();

        const filteredRecords = rawRecords.filter((record) => {
            const recordDate = normalizeDateInput(record.date_debut_appel);
            const recordTime = normalizeTimeInput(record.heure_debut_appel);

            if (dateStart && (!recordDate || recordDate < dateStart)) {
                return false;
            }

            if (dateEnd && (!recordDate || recordDate > dateEnd)) {
                return false;
            }

            if (timeStart && (!recordTime || recordTime < timeStart)) {
                return false;
            }

            if (timeEnd && (!recordTime || recordTime > timeEnd)) {
                return false;
            }

            return true;
        });

        const mode = numeroFilter && imeiFilter ? 'combined' : numeroFilter ? 'numero' : 'imei';
        const aggregates = new Map();

        filteredRecords.forEach((record) => {
            const recordDate = normalizeDateInput(record.date_debut_appel);
            const recordTime = normalizeTimeInput(record.heure_debut_appel);

            if (mode === 'numero') {
                const imeiValue = normalizeIdentifier(record.imei_appelant);
                updateAggregation(aggregates, imeiValue, recordDate, recordTime);
            } else if (mode === 'imei') {
                const numeroValue = normalizeIdentifier(record.numero_appelant);
                updateAggregation(aggregates, numeroValue, recordDate, recordTime);
            } else {
                const numeroValue = normalizeIdentifier(record.numero_appelant);
                const imeiValue = normalizeIdentifier(record.imei_appelant);

                if (!numeroValue || !imeiValue) {
                    return;
                }

                const compositeKey = `${numeroValue}:::${imeiValue}`;
                updateAggregation(aggregates, compositeKey, recordDate, recordTime, {
                    numero: numeroValue,
                    imei: imeiValue,
                });
            }
        });

        const buildSortedResults = (mapper) => {
            const entries = Array.from(aggregates.entries()).map(mapper);
            entries.sort((a, b) => {
                const aValue = typeof a.sortValue === 'number' ? a.sortValue : Number.NEGATIVE_INFINITY;
                const bValue = typeof b.sortValue === 'number' ? b.sortValue : Number.NEGATIVE_INFINITY;
                return bValue - aValue;
            });

            return entries.map(({ sortValue, ...rest }) => rest);
        };

        let results = [];

        if (mode === 'numero') {
            results = buildSortedResults(([imeiValue, data]) => ({
                imei: imeiValue,
                lastUsage: data.lastUsage,
                lastUsageDate: data.lastUsageDate,
                lastUsageTime: data.lastUsageTime,
                sortValue: data.sortValue,
            }));
        } else if (mode === 'imei') {
            results = buildSortedResults(([numeroValue, data]) => ({
                numero: numeroValue,
                lastUsage: data.lastUsage,
                lastUsageDate: data.lastUsageDate,
                lastUsageTime: data.lastUsageTime,
                sortValue: data.sortValue,
            }));
        } else {
            results = buildSortedResults(([, data]) => ({
                numero: data.numero,
                imei: data.imei,
                lastUsage: data.lastUsage,
                lastUsageDate: data.lastUsageDate,
                lastUsageTime: data.lastUsageTime,
                sortValue: data.sortValue,
            }));
        }

        return res.json({
            mode,
            results,
            filters: {
                numero: numeroFilter,
                imei: imeiFilter,
                dateStart,
                dateEnd,
                timeStart,
                timeEnd,
            },
            totalRecords: results.length,
        });
    } catch (error) {
        console.error('Error while searching fraud records:', error);
        return res.status(500).json({
            message: "Une erreur est survenue lors de la recherche des enregistrements de fraude.",
        });
    }
};

// Log Controllers

module.exports.addLog = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Log.create(req.body)
        .then(newLog=>res.json(newLog))
        .catch(err=>res.status(400).json(err))
}

module.exports.getLogs = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Log.find()
        .then(Logs=>res.json(Logs))
        .catch(err=>res.status(400).json(err))
}

module.exports.deleteLogs = (req, res) => {
    if (!ensureDatabaseConnection(res)) {
        return;
    }
    Log.deleteMany({scan: { $ne: "foo" }})
        .then(Logs=>res.json(Logs))
        .catch(err=>res.status(400).json(err))
}

// Scanning Controllers

const proxyConfig = {
    protocol: 'http',
    host: '127.0.0.1',
    port: 8080,
  };

async function fetchUrlsThroughProxy(urlList) {
    for (const url of urlList) {
        if (url.includes("https://")){
            continue;
        }
        try {
        const response = await axios.get(url, {
          proxy: proxyConfig
        });
      } catch (error) {
        console.error(`Error while fetching ${url}:`);
        console.error(error.message);
      }
    }
  }
    
module.exports.getHttpOnly = (req, res) => {
    fetchUrlsThroughProxy(req.body)
    .then((responses) => {
      console.log('All requests completed:');
      console.log(responses);
    })
    .catch((err) => {
      console.error('Error:', err);
    });
}

const formatBurpError = (error) => {
    if (!error) {
        return 'Unknown error communicating with Burp API.';
    }

    if (error.response) {
        const status = error.response.status;
        const statusText = error.response.statusText || 'Unknown status';
        const details = typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data);

        return `Burp API responded with status ${status} (${statusText}). Details: ${details}`;
    }

    if (error.request) {
        return 'Aucune réponse reçue de l\'API Burp. Vérifiez que le service est joignable sur http://127.0.0.1:1337.';
    }

    return error.message || 'Unknown error communicating with Burp API.';
};

module.exports.populateBurp = async (req, res) => {
    const urls = Array.isArray(req.body) ? req.body.filter(Boolean) : [];

    if (urls.length === 0) {
        return res.status(400).json({
            message: "Aucune URL valide n'a été fournie pour l'import dans Burp Suite.",
        });
    }

    const burpScan = {
        urls,
        scan_configurations: [
            {
                type: "NamedConfiguration",
                name: "Crawl and Audit - Fast",
            },
        ],
    };

    try {
        const response = await axios.post("http://127.0.0.1:1337/v0.1/scan", burpScan);
        return res.status(202).json({
            message: "Import des URLs dans Burp Suite déclenché avec succès.",
            burpResponse: response.data,
        });
    } catch (error) {
        console.error('Error while populating Burp:', error);
        return res.status(502).json({
            message: "Impossible de communiquer avec l'API Burp Suite.",
            details: formatBurpError(error),
        });
    }
};

module.exports.runBurpScanDefault = async (req, res) => {
    const targetUrl = req.body && req.body.targetUrl;

    if (typeof targetUrl !== 'string' || targetUrl.trim() === '') {
        return res.status(400).json({
            message: "L'URL cible du scan est requise.",
        });
    }

    const burpScan = {
        urls: [targetUrl.trim()],
    };

    try {
        const response = await axios.post("http://127.0.0.1:1337/v0.1/scan", burpScan);
        return res.status(202).json({
            message: "Scan Burp par défaut déclenché.",
            burpResponse: response.data,
        });
    } catch (error) {
        console.error('Error while triggering Burp default scan:', error);
        return res.status(502).json({
            message: "Impossible de lancer le scan Burp par défaut.",
            details: formatBurpError(error),
        });
    }
};

module.exports.runBurpScanDeep = async (req, res) => {
    const targetUrl = req.body && req.body.targetUrl;

    if (typeof targetUrl !== 'string' || targetUrl.trim() === '') {
        return res.status(400).json({
            message: "L'URL cible du scan est requise.",
        });
    }

    const burpScan = {
        urls: [targetUrl.trim()],
        scan_configurations: [
            {
                type: "NamedConfiguration",
                name: "Crawl and Audit - Deep",
            },
        ],
    };

    try {
        const response = await axios.post("http://127.0.0.1:1337/v0.1/scan", burpScan);
        return res.status(202).json({
            message: "Scan Burp approfondi déclenché.",
            burpResponse: response.data,
        });
    } catch (error) {
        console.error('Error while triggering Burp deep scan:', error);
        return res.status(502).json({
            message: "Impossible de lancer le scan Burp approfondi.",
            details: formatBurpError(error),
        });
    }
};
