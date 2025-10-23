import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Component.css';

const Chaining = props => {
    const urls = props.thisFqdn.targetUrls || [];
    const [activeEndpointTab, setActiveEndpointTab] = useState(0);
    const [urlData, setUrlData] = useState({ endpoints: [] });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setActiveEndpointTab(0);
    }, [props.thisFqdn._id, props.thisFqdn.targetUrls]);

    useEffect(() => {
        const targetUrlList = props.thisFqdn.targetUrls || [];
        const targetUrl = targetUrlList[activeEndpointTab];
        if (!targetUrl) {
            setUrlData({ endpoints: [] });
            return;
        }

        setLoaded(false);
        axios.post('/api/url/auto', { url: targetUrl })
            .then(res => {
                if (res.data) {
                    setUrlData(res.data);
                } else {
                    setUrlData({
                        endpoints: []
                    });
                }
                setLoaded(true);
            })
            .catch(err => console.log(err));
    }, [activeEndpointTab, props.thisFqdn._id, props.thisFqdn.targetUrls]);

    const handleEndpointChange = (event) => {
        setActiveEndpointTab(Number(event.target.value));
    };

    return (
        <>
        <nav className="pl-2 pt-0 navbar navbar-expand-lg modern-toolbar">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <h5 className="toolbar-text ml-4 pt-0 mb-0">
                        URL cible : &nbsp;&nbsp;
                        <a
                            className="toolbar-link"
                            target="_blank"
                            rel="noreferrer"
                            href={urls[activeEndpointTab] || '#'}
                        >
                            {urls[activeEndpointTab] || 'Aucune URL disponible'}
                        </a>
                    </h5>
                    {urls.length > 1 && (
                        <select
                            className="form-select ms-3"
                            value={activeEndpointTab}
                            onChange={handleEndpointChange}
                            aria-label="Sélectionner une URL cible"
                        >
                            {urls.map((url, index) => (
                                <option value={index} key={url}>
                                    {url}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </nav>
        <div className="bg-secondary checklistStyle ml-4">
            <ul>
                <li>Entrée reflétée</li>
                <ul>
                    <li>Script intersite (XSS)</li>
                    <ul>
                        <li>Contournement CORS</li>
                        <li>Détournement de session</li>
                    </ul>
                </ul>
                <li>Redirection ouverte</li>
                <ul>
                    <li>Chemins alternatifs</li>
                    <li>Sous-domaines alternatifs</li>
                    <li>FQDN alternatifs</li>
                </ul>    
            </ul>
        </div>
        <div className="bg-secondary workTableStyle">
            {loaded ? (
                urlData.endpoints && urlData.endpoints.length > 0 ? (
                    <ul>
                        {urlData.endpoints.map((endpoint, index) => (
                            <li key={index}>{endpoint}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun endpoint détecté pour cette URL.</p>
                )
            ) : (
                <p>Analyse des endpoints en cours...</p>
            )}
        </div>
        </>
    )
}

export default Chaining;