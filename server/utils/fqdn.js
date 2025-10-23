const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeFqdn = (value) => {
    if (typeof value !== 'string') {
        return '';
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return '';
    }

    const withoutScheme = trimmed.replace(/^(?:https?:\/\/)/i, '');
    const withoutCredentials = withoutScheme.replace(/^[^@]+@/, '');
    const withoutPath = withoutCredentials.split(/[/?#]/)[0];
    const withoutTrailingDot = withoutPath.replace(/\.+$/, '');
    const withoutRegexChars = withoutTrailingDot.replace(/[\\^$]/g, '');

    return withoutRegexChars.toLowerCase();
};

const buildFqdnQuery = (fqdn) => ({ fqdn: new RegExp(`^${escapeRegExp(fqdn)}$`, 'i') });

module.exports = {
    escapeRegExp,
    normalizeFqdn,
    buildFqdnQuery,
};
