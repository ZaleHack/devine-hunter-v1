import React, {useState, useEffect} from 'react';
import axios from 'axios';import '../Component.css';

const Chaining = props => {
    const [urls, setUrls] = useState(props.thisFqdn.targetUrls)
    const [activeEndpointTab, setActiveEndpointTab] = useState(0);
    const [urlData, setUrlData] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        setLoaded(false);
        axios.post('/api/url/auto', {url:props.thisFqdn.targetUrls[activeEndpointTab]})
        .then(res=>{
            if (res.data){
                setUrlData(res.data);
            } else {
                setUrlData({
                    "endpoints": []
                })
            }
            setLoaded(true);
        })
        .catch(err=>console.log(err))
    }, [activeEndpointTab]);

    return (
        <>
        <nav className="pl-2 pt-0 navbar navbar-expand-lg modern-toolbar">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <h5 className="toolbar-text ml-4 pt-0 mb-0">URL cible : &nbsp;&nbsp;<a className="toolbar-link" target="_blank" rel="noreferrer" href={urls[0]}>{urls[0]}</a></h5>
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
        </div>
        </>
    )
}

export default Chaining;