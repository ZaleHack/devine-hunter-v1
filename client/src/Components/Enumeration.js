import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../Component.css';

const Enumeration = props => {
    const [loaded, setLoaded] = useState(false)
    const [urls, setUrls] = useState(props.thisFqdn.recon.subdomains.httprobe)
    const [selectedUrl, setSelectedUrl] = useState(props.thisFqdn.recon.subdomains.httprobe[0]  || "https://" + props.thisFqdn.fqdn)
    const [finalSelectedUrl, setFinalSelectedUrl] = useState(props.thisFqdn.recon.subdomains.httprobe[0]  || "https://" + props.thisFqdn.fqdn)
    const [targetUrl, setTargetUrl] = useState(props.thisFqdn.recon.subdomains.httprobe[0] || "https://" + props.thisFqdn.fqdn)
    const [aRecords, setARecords] = useState([])
    const [cnameRecords, setCnameRecords] = useState([])
    const [nodeRecords, setNodeRecords] = useState([])

    useEffect(()=>{
        setARecords(props.thisFqdn.dns.arecord)
        setCnameRecords(props.thisFqdn.dns.cnamerecord)
        setNodeRecords(props.thisFqdn.dns.node)
        setLoaded(true)
    }, [props.index]);

    const populateBurp = () => {
        axios.post('http://localhost:8000/api/populate-burp', urls)
          .then(res=>{
            console.log(res);
          })
          .catch(err=>console.log(err))
      }

    const runDefaultScan = () => {
    const data = {
        targetUrl: targetUrl
    }
    axios.post('http://localhost:8000/api/scan/default', data)
        .then(res=>{
        console.log(res);
        })
        .catch(err=>console.log(err))
    }

    const runDeepScan = () => {
        const data = {
            targetUrl: targetUrl
        }
        axios.post('http://localhost:8000/api/scan/deep', data)
            .then(res=>{
            console.log(res);
            })
            .catch(err=>console.log(err))
        }

    const handleTargetUrl = () => {
        setTargetUrl(selectedUrl)
    }

    async function getFinalRedirectUrl(initialUrl) {
        try {
          const response = await axios.get(initialUrl, {
            maxRedirects: 10,
            validateStatus: (status) => status >= 200 && status < 400,
          });
          if (initialUrl !== response.request.res.responseUrl) {
            
          }
          return response.request.res.responseUrl;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
    }

    const handleSelectUrl = (e, i) => {
        setSelectedUrl(urls[i]);
    }

    return (
        <div>
        <nav className="pl-2 pt-0 navbar navbar-expand-lg modern-toolbar">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <button onClick={populateBurp} style={{width: '135px'}} className="nav-link btn btn-elevated text-light">Remplir Burp</button>
                    <h5 className="toolbar-text ml-4 pt-0 mb-0">URL cible : &nbsp;&nbsp;<a className="toolbar-link" target="_blank" rel="noreferrer" href="">{targetUrl}</a></h5>
                    <button onClick={runDefaultScan} style={{width: '135px'}} className="nav-link btn btn-elevated text-light ml-5">Analyse par défaut</button>
                    <button onClick={runDeepScan} style={{width: '135px'}} className="nav-link btn btn-outline-light ml-2">Analyse approfondie</button>
                </div>
            </div>
        </nav>
                <div className="container-fluid">
                <div className="row">
        <div className="bg-secondary checklistStyle ml-4 col-3" style={{width: '1500px', height: '300px', padding: '5px', border: '1px solid black', overflowY: 'scroll'}}>
            <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
            {
                urls.map((url, i) => { return (
                    <div>
                        <li
                            key={i}
                            onClick={(e) => handleSelectUrl(e, i)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <span>{url}</span>
                            <img
                            className="mt-3"
                            src={"/screenshots/" + url.replace("//", "__") + ".png"}
                            style={{ width: '10%', height: '10%' }}
                            />
                        </li>
                    </div>
                )})
            }        
            </ul>
        </div>
        <div style={{overflowY:"scroll"}} className="bg-secondary workTableStyle col-8">
            <button onClick={handleTargetUrl} className="nav-link btn btn-elevated text-light mt-3 mb-3">Définir comme URL cible</button>
            <h2><a href={selectedUrl}>{selectedUrl}</a></h2>
            <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
            {
                aRecords.sort().filter(record => record.split(" ")[0] === selectedUrl.split("//")[1].split(":")[0]).map((record, i) => { return (
                    <li key={i}>{record}</li>
                    )})
            }
            {
                cnameRecords.sort().filter(record => record.split(" ")[0] === selectedUrl.split("//")[1].split(":")[0]).map((record, i) => { return (
                    <li key={i}>{record}</li>
                    )})
            }
            {
                nodeRecords.sort().filter(record => record.split(" ")[0] === selectedUrl.split("//")[1].split(":")[0]).map((record, i) => { return (
                    <li key={i}>{record}</li>
                    )})
            }
            </ul>
            <img className="mt-3" src={"/screenshots/" + selectedUrl.replace("//","__") + ".png"} style={{width: '95%', height: '95%'}}/>
        </div>
        </div>
        </div>
        </div>
    )
}

export default Enumeration;