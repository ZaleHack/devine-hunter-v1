import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import UrlForm from '../HelperComponents/UrlForm';

const GithubOsint = props => {
    const [urls, setUrls] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const normalise = (value) => {
            if (typeof value !== 'string') {
                return null;
            }

            const trimmed = value.trim();
            if (!trimmed) {
                return null;
            }

            return trimmed
                .replace(/^https?:\/\//i, '')
                .replace(/\/+$/, '');
        };

        const buildUrlArray = (additionalUrls = []) => {
            const combined = [
                props.thisFqdn?.fqdn,
                ...additionalUrls,
                ...(Array.isArray(props.thisFqdn?.targetUrls) ? props.thisFqdn.targetUrls : [])
            ];

            const deduped = [];
            const seen = new Set();

            combined.forEach((rawUrl) => {
                const cleaned = normalise(rawUrl);

                if (!cleaned || seen.has(cleaned)) {
                    return;
                }

                seen.add(cleaned);
                deduped.push(cleaned);
            });

            return deduped;
        };

        const fetchUrls = async () => {
            setLoaded(false);
            try {
                const response = await axios.post('/api/urllist', { fqdnId: props.thisFqdn._id });
                const remoteUrls = Array.isArray(response.data?.eyeWitness) ? response.data.eyeWitness : [];

                if (isMounted) {
                    setUrls(buildUrlArray(remoteUrls));
                }
            } catch (error) {
                console.error('Error fetching URL list for GitHub OSINT:', error);

                if (isMounted) {
                    setUrls(buildUrlArray());
                }
            } finally {
                if (isMounted) {
                    setLoaded(true);
                }
            }
        };

        fetchUrls();

        return () => {
            isMounted = false;
        };
    }, [props.thisFqdn._id, props.thisFqdn.fqdn, props.thisFqdn?.targetUrls]);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p>The links below can be used search for source code on GitHub.</p>
                    <div style={{padding: '10px', height: '225px', width: '1000px', overflowY: 'scroll', border: '1px solid black'}}>
                        {
                            loaded && urls.map((url, i)=>{
                                return (
                                    <div key={i}>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3ABash&type=code`} target="_blank" rel="noreferrer">"{url}" language:Bash</a></p>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3APython&type=code`} target="_blank" rel="noreferrer">"{url}" language:Python</a></p>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3APHP&type=code`} target="_blank" rel="noreferrer">"{url}" language:PHP</a></p>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3ARuby&type=code`} target="_blank" rel="noreferrer">"{url}" language:Ruby</a></p>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3APerl&type=code`} target="_blank" rel="noreferrer">"{url}" language:Perl</a></p>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3APowerShell&type=code`} target="_blank" rel="noreferrer">"{url}" language:PowerShell</a></p>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3ALua&type=code`} target="_blank" rel="noreferrer">"{url}" language:Lua</a></p>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3AGroovy&type=code`} target="_blank" rel="noreferrer">"{url}" language:Groovy</a></p>
                                    <p className="m-0"><a href={`https://github.com/search?q="${url}"+language%3AGo&type=code`} target="_blank" rel="noreferrer">"{url}" language:Go</a></p>
                                    </div>
                                )
                            })
                        }
                        

                    </div>
                </div>
            </div>
            <div className="row">
                <UrlForm thisFqdn={props.thisFqdn} thisScanner="Github"/>
            </div>
        </div>
    )
}

export default GithubOsint;