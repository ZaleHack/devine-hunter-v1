const { Fqdn } = require("../models/fqdn.model");
const { Url } = require("../models/url.model");
const { Cve } = require("../models/cve.model");
const { Log } = require("../models/log.model");
const { normalizeFqdn, buildFqdnQuery } = require("../utils/fqdn");
const util = require('util');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const execFile = require('child_process').execFile;
const execSync = util.promisify(require('child_process').execSync);
const axios = require('axios');
const https = require('https');

module.exports.ping = (req, res) => {
    res.json({ message: "pong" });
}

// CVE Controllers

module.exports.addCve = (req, res) => {
    
    Cve.create(req.body)
        .then(newCve=>res.json(newCve))
        .catch(err=>res.status(400).json(err))
}

module.exports.getCves = (req, res) => {
    
    Cve.find()
        .then(Cves=>res.json(Cves))
        .catch(err=>res.status(400).json(err))
}

module.exports.deleteCve = (req, res) => {
    
    Cve.deleteOne({ cve: req.body.cve })
        .then(result=>res.json({success:true}))
        .catch(err=>res.status(400).json(err))
}

// Fqdn Controllers

module.exports.addFqdn = async (req, res) => {
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
    
    Fqdn.find()
        .then(fqdns=>res.json(fqdns))
        .catch(err=>res.status(400).json(err))
}

module.exports.getFqdn = (req, res) => {
    
    Fqdn.findOne({ _id: req.body._id })
        .then(oneFqdn=>res.json(oneFqdn))
        .catch(err=>res.status(400).json(err))
}

module.exports.deleteFqdn = (req, res) => {
    
    Fqdn.deleteOne({ _id: req.body._id })
        .then(result=>res.json({success:true}))
        .catch(err=>res.status(400).json(err))
}

module.exports.updateFqdn = (req, res) => {
    console.log(req.body)
    Fqdn.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true, runValidators: true })
        .then(result=>res.json(result))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoGetFqdn = (req, res) => {
    const normalizedFqdn = normalizeFqdn(req.body && req.body.fqdn);

    if (!normalizedFqdn) {
        return res.status(400).json({ message: "Le champ FQDN est requis." });
    }

    Fqdn.findOne(buildFqdnQuery(normalizedFqdn))
        .then(oneFqdn=>res.json(oneFqdn))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoUpdateFqdn = (req, res) => {
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
    
    Url.create(req.body)
        .then(newUrl=>res.json(newUrl))
        .catch(err=>res.status(400).json(err))
}

module.exports.getUrls = (req, res) => {
    
    Url.find()
        .then(urls=>res.json(urls))
        .catch(err=>res.status(400).json(err))
}

module.exports.getUrl = (req, res) => {
    
    Url.findOne({ _id: req.body._id })
        .then(oneUrl=>res.json(oneUrl))
        .catch(err=>res.status(400).json(err))
}

module.exports.deleteUrl = (req, res) => {
    
    Url.deleteOne({ _id: req.body._id })
        .then(result=>res.json({success:true}))
        .catch(err=>res.status(400).json(err))
}

module.exports.updateUrl = (req, res) => {
    
    Url.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true, runValidators: true })
        .then(result=>res.json(result))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoGetUrl = (req, res) => {
    
    Url.findOne({ url: req.body.url })
        .then(oneUrl=>res.json(oneUrl))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoUpdateUrl = (req, res) => {
    
    Url.findOneAndUpdate(
        { url: req.body.url },
        req.body,
        { new: true, runValidators: true })
        .then(result=>res.json(result))
        .catch(err=>res.status(400).json(err))
}

module.exports.autoDeleteUrl = (req, res) => {

    Url.deleteOne({ url: req.body.url })
        .then(result=>res.json({success:true}))
        .catch(err=>res.status(400).json(err))
}

module.exports.getUrlList = async (req, res) => {
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

// Log Controllers

module.exports.addLog = (req, res) => {
    
    Log.create(req.body)
        .then(newLog=>res.json(newLog))
        .catch(err=>res.status(400).json(err))
}

module.exports.getLogs = (req, res) => {
    
    Log.find()
        .then(Logs=>res.json(Logs))
        .catch(err=>res.status(400).json(err))
}

module.exports.deleteLogs = (req, res) => {
    
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

module.exports.populateBurp = (req, res) => {
    console.log(req.body)
    const burpScan = {
            urls: req.body,
            scan_configurations: [{
                type: "NamedConfiguration",
                name: "Crawl and Audit - Fast"
            }]
    }
    axios.post("http://127.0.0.1:1337/v0.1/scan", burpScan)
        .then((response) => {
            console.log('Response:', response.data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

module.exports.runBurpScanDefault = (req, res) => {
    console.log(req.body.targetUrl)
    const burpScan = {
            urls: [req.body.targetUrl]
    }
    axios.post("http://127.0.0.1:1337/v0.1/scan", burpScan)
        .then((response) => {
            console.log('Response:', response.data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

module.exports.runBurpScanDeep = (req, res) => {
    console.log(req.body.targetUrl)
    const burpScan = {
            urls: [req.body.targetUrl],
            scan_configurations: [{
                type: "NamedConfiguration",
                name: "Crawl and Audit - Deep"
    }]
    }
    console.log(burpScan)
    axios.post("http://127.0.0.1:1337/v0.1/scan", burpScan)
        .then((response) => {
            console.log('Response:', response.data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}