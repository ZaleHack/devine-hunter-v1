const mongoose = require('mongoose');

const ensureArrayPaths = [
    'dns.arecord',
    'dns.aaaarecord',
    'dns.cnamerecord',
    'dns.mxrecord',
    'dns.txtrecord',
    'dns.node',
    'dns.nsrecord',
    'dns.srvrecord',
    'dns.ptrrecord',
    'dns.spfrecord',
    'dns.soarecord',
    'aws.s3',
    'aws.ec2',
    'aws.cloudfront',
    'aws.elb',
    'aws.documentdb',
    'aws.api_gateway',
    'aws.elasticbeanstalk',
    'gcp.bucket',
    'ips',
    'subnets',
    'asns',
    'isps',
    'recon.subdomains.gospider',
    'recon.subdomains.hakrawler',
    'recon.subdomains.subdomainizer',
    'recon.subdomains.sublist3r',
    'recon.subdomains.amass',
    'recon.subdomains.assetfinder',
    'recon.subdomains.gau',
    'recon.subdomains.ctl',
    'recon.subdomains.shosubgo',
    'recon.subdomains.subfinder',
    'recon.subdomains.githubSearch',
    'recon.subdomains.shuffledns',
    'recon.subdomains.shufflednsCustom',
    'recon.subdomains.cloudRanges',
    'recon.subdomains.consolidated',
    'recon.subdomains.consolidatedNew',
    'recon.subdomains.httprobe',
    'recon.subdomains.httprobeAdded',
    'recon.subdomains.httprobeRemoved',
    'recon.subdomains.masscan',
    'recon.subdomains.masscanAdded',
    'recon.subdomains.masscanRemoved',
    'recon.subdomains.masscanLive',
    'recon.osint.notableRepos',
    'recon.osint.GithubSearch',
    'recon.osint.GithubUsers',
    'recon.osint.Google',
    'recon.osint.Shodan',
    'recon.osint.Censys',
    'vulns',
    'vulnsSSL',
    'vulnsFile',
    'vulnsDNS',
    'vulnsVulns',
    'vulnsTech',
    'vulnsMisconfig',
    'vulnsCVEs',
    'vulnsCNVD',
    'vulnsExposed',
    'vulnsExposure',
    'vulnsMisc',
    'vulnsNetwork',
    'vulnsRs0n',
    'vulnsHeadless',
    'targetUrls'
];

const ensureNestedArray = (doc, path, shouldMarkModified = false) => {
    const segments = path.split('.');
    let current = doc;

    for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i];
        if (current[key] === undefined || current[key] === null) {
            current[key] = {};
        }
        current = current[key];
    }

    const lastKey = segments[segments.length - 1];
    if (!Array.isArray(current[lastKey])) {
        current[lastKey] = [];
        if (shouldMarkModified && typeof doc.markModified === 'function') {
            doc.markModified(path);
        }
    }
};

const ensureFqdnDefaults = (doc, { markModified = false } = {}) => {
    if (!doc) {
        return;
    }

    ensureArrayPaths.forEach((path) => ensureNestedArray(doc, path, markModified));

    const rawAzure = doc.azure && typeof doc.azure.toObject === 'function' ? doc.azure.toObject() : (doc.azure || {});
    if (rawAzure.placeholder === undefined) {
        rawAzure.placeholder = '';
    }

    if (typeof doc.set === 'function') {
        doc.set('azure', rawAzure);
    } else {
        doc.azure = rawAzure;
    }

    if (markModified && typeof doc.markModified === 'function') {
        doc.markModified('azure');
    }
};

const FqdnSchema = new mongoose.Schema({
    fqdn: {type:String},
    dns: {
        arecord: [{
            type: String
        }],
        aaaarecord: [{
            type: String
        }],
        cnamerecord: [{
            type: String
        }],
        mxrecord: [{
            type: String
        }],
        txtrecord: [{
            type: String
        }],
        node: [{
            type: String
        }],
        nsrecord: [{
            type: String
        }],
        srvrecord: [{
            type: String
        }],
        ptrrecord: [{
            type: String
        }],
        spfrecord: [{
            type: String
        }],
        soarecord: [{
            type: String
        }]
    },
    aws: {
        s3: [{
            domain: {type: String},
            public: {
                type: Boolean,
                default: false
            },
            downloadExploit: {
                type: Boolean,
                default: false
            },
            uploadExploit: {
                type: Boolean,
                default: false
            },
            authenticated: {
                type: Boolean,
                default: false
            },
            subdomainTakeover: {
                type: Boolean,
                default: false
            },
            files: [{
                type: String
            }]
        }],
        ec2: [{
            type: String
        }],
        cloudfront: [{
            type: String
        }],
        elb: [{
            type: String
        }],
        documentdb: [{
            type: String
        }],
        api_gateway: [{
            type: String
        }],
        elasticbeanstalk: [{
            domain: {type: String},
            subdomainTakeover: {
                type: Boolean,
                default: false
            }
        }]
    },
    azure: {
        placeholder: {type: String}
    },
    gcp: {
        bucket: [{
            domain: {type: String},
            bucketSniping: {
                type: Boolean,
                default: false
            }
        }]
    },
    ips: [{
        ip: {type: String},
        ports: [{
            type: String
        }]
    }],
    subnets: [{
        type: String
    }],
    asns: [{
        type: String
    }],
    isps: [{
        type: String
    }],
    recon: {
        subdomains: {
            gospider: [{
                type: String
            }],
            hakrawler: [{
                type: String
            }],
            subdomainizer: [{
                type: String
            }],
            sublist3r: [{
                type: String
            }],
            amass: [{
                type: String
            }],
            assetfinder: [{
                type: String
            }],
            gau : [{
                type: String
            }],
            ctl : [{
                type: String
            }],
            shosubgo : [{
                type: String
            }],
            subfinder : [{
                type: String
            }],
            githubSearch : [{
                type: String
            }],
            shuffledns : [{
                type: String
            }],
            shufflednsCustom : [{
                type: String
            }],
            cloudRanges : [{
                type: String
            }],
            consolidated : [{
                type: String
            }],
            consolidatedNew : [{
                type: String
            }],
            httprobe : [{
                type: String
            }],
            httprobeAdded : [{
                type: String
            }],
            httprobeRemoved : [{
                type: String
            }],
            masscan : [{
                type: String,
            }],
            masscanAdded : [{
                type: String
            }],
            masscanRemoved : [{
                type: String
            }],
            masscanLive : [{
                type: String
            }]
        },
        osint: {
            notableRepos: [{
                type: String
            }],
            GithubSearch: [{
                payload: String,
                results: Number,
                url: String
            }],
            GithubUsers: [{
                username: String,
                githubUrl: String
            }],
            Google: [{
                type: String
            }],
            Shodan: [{
                type: String
            }],
            Censys: [{
                type: String
            }]
        }
    },
    vulns: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsSSL: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsFile: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsDNS: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsVulns: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsTech: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsMisconfig: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsCVEs: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsCNVD: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsExposed: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsExposure: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsMisc: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsNetwork: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsRs0n: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    vulnsHeadless: [{
        impactful: {type: Boolean},
        host: {type: String},
        "template-id": {type: String},
        info: {
            author: [{
                type: String
            }],
            description: {type: String},
            name: {type: String},
            reference: [{
                type: String
            }],
            severity: {type: String},
            tags: [{
                type: String
            }]
        },
        "extracted-results": [{
            type: String
        }],
        ip: {type: String},
        "matched-at": {type: String},
        "matcher-name": {type: String},
        timestamp: {type: String},
        type: {type: String},
        "curl-command":{type: String},
    }],
    targetUrls: [{
        type: String
    }]
}, {timestamps: true});

FqdnSchema.pre('validate', function(next) {
    ensureFqdnDefaults(this, { markModified: true });
    next();
});

FqdnSchema.post('init', function(doc) {
    ensureFqdnDefaults(doc);
});

FqdnSchema.post('save', function(doc) {
    ensureFqdnDefaults(doc);
});

FqdnSchema.post('find', function(docs) {
    docs.forEach((doc) => ensureFqdnDefaults(doc));
});

FqdnSchema.post('findOne', function(doc) {
    ensureFqdnDefaults(doc);
});

FqdnSchema.post('findOneAndUpdate', function(doc) {
    ensureFqdnDefaults(doc);
});

module.exports.Fqdn = mongoose.model("Fqdn", FqdnSchema);