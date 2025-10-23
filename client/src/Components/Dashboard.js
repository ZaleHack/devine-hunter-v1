import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../Component.css';

const Dashboard = props => {
    const thisFqdn = props?.thisFqdn;
    const [vulnCount, setVulnCount] = useState(0)
    const [impactfulVulnCount, setImpactfulVulnCount] = useState(0)
    const [impactfulVulnArray, setImpactfulVulnArray] = useState([])
    const formatUpdated = thisFqdn?.updatedAt.replace(/([A-Z])+/g, " ").replace(/(\.[0-9]+)/g, " GMT");
    const [impactfulVulnCountSSL, setImpactfulVulnCountSSL] = useState(0)
    const [impactfulVulnCountFile, setImpactfulVulnCountFile] = useState(0)
    const [impactfulVulnCountDNS, setImpactfulVulnCountDNS] = useState(0)
    const [impactfulVulnCountVulns, setImpactfulVulnCountVulns] = useState(0)
    const [impactfulVulnCountTech, setImpactfulVulnCountTech] = useState(0)
    const [impactfulVulnCountMisconfig, setImpactfulVulnCountMisconfig] = useState(0)
    const [impactfulVulnCountCVEs, setImpactfulVulnCountCVEs] = useState(0)
    const [impactfulVulnCountCNVD, setImpactfulVulnCountCNVD] = useState(0)
    const [impactfulVulnCountExposed, setImpactfulVulnCountExposed] = useState(0)
    const [impactfulVulnCountExposure, setImpactfulVulnCountExposure] = useState(0)
    const [impactfulVulnCountMisc, setImpactfulVulnCountMisc] = useState(0)
    const [impactfulVulnCountNetwork, setImpactfulVulnCountNetwork] = useState(0)
    const [impactfulVulnCountRs0n, setImpactfulVulnCountRs0n] = useState(0)
    const [impactfulVulnCountHeadless, setImpactfulVulnCountHeadless] = useState(0)
    const [impactfulVulnCountFull, setImpactfulVulnCountFull] = useState(0)
    const [impactfulVulnFoundSSL, setImpactfulVulnFoundSSL] = useState(false)
    const [impactfulVulnFoundFile, setImpactfulVulnFoundFile] = useState(false)
    const [impactfulVulnFoundDNS, setImpactfulVulnFoundDNS] = useState(false)
    const [impactfulVulnFoundVulns, setImpactfulVulnFoundVulns] = useState(false)
    const [impactfulVulnFoundTech, setImpactfulVulnFoundTech] = useState(false)
    const [impactfulVulnFoundMisconfig, setImpactfulVulnFoundMisconfig] = useState(false)
    const [impactfulVulnFoundCVEs, setImpactfulVulnFoundCVEs] = useState(false)
    const [impactfulVulnFoundCNVD, setImpactfulVulnFoundCNVD] = useState(false)
    const [impactfulVulnFoundExposed, setImpactfulVulnFoundExposed] = useState(false)
    const [impactfulVulnFoundExposure, setImpactfulVulnFoundExposure] = useState(false)
    const [impactfulVulnFoundMisc, setImpactfulVulnFoundMisc] = useState(false)
    const [impactfulVulnFoundNetwork, setImpactfulVulnFoundNetwork] = useState(false)
    const [impactfulVulnFoundRs0n, setImpactfulVulnFoundRs0n] = useState(false)
    const [impactfulVulnFoundHeadless, setImpactfulVulnFoundHeadless] = useState(false)
    
    useEffect(()=>{
        axios.post('/api/fqdn', {_id:props.thisFqdn._id})
        .then((res) => {
            if (res.data !== null) {
                const fullVulnCount = res.data.vulns.reduce((count, vuln) => (
                    vuln.info.severity !== "foo" ? count + 1 : count
                ), 0);
                setImpactfulVulnCountFull(fullVulnCount);
                setImpactfulVulnFoundMisconfig(false)
                setImpactfulVulnFoundSSL(false)
                setImpactfulVulnFoundFile(false)
                setImpactfulVulnFoundDNS(false)
                setImpactfulVulnFoundVulns(false)
                setImpactfulVulnFoundTech(false)
                setImpactfulVulnFoundCVEs(false)
                setImpactfulVulnFoundCNVD(false)
                setImpactfulVulnFoundExposed(false)
                setImpactfulVulnFoundExposure(false)
                setImpactfulVulnFoundMisc(false)
                setImpactfulVulnFoundNetwork(false)
                setImpactfulVulnFoundRs0n(false)
                setImpactfulVulnFoundHeadless(false)
                const vulnArrays = [
                    res.data.vulns,
                    res.data.vulnsSSL,
                    res.data.vulnsFile,
                    res.data.vulnsDNS,
                    res.data.vulnsVulns,
                    res.data.vulnsTech,
                    res.data.vulnsMisconfig,
                    res.data.vulnsCVEs,
                    res.data.vulnsCNVD,
                    res.data.vulnsExposed,
                    res.data.vulnsExposure,
                    res.data.vulnsMisc,
                    res.data.vulnsNetwork,
                    res.data.vulnsRs0n,
                    res.data.vulnsHeadless,
                ];
            
                let impactfulVulnArrays = [];
                let vulnCount = 0;
                let impactfulVulnCount = 0;
            
                vulnArrays.forEach((vulnArray) => {
                    vulnArray.forEach((vuln) => {
                    if (vuln.info.severity !== "foo") {
                        vulnCount++;
                        if (vuln.info.severity !== "foo" && vuln.info.severity !== "info") {
                        impactfulVulnCount++;
                        impactfulVulnArrays.push(vuln);
                        }
                    }
                    });
                });
            
                setImpactfulVulnArray(impactfulVulnArrays);
                setVulnCount(vulnCount);
                setImpactfulVulnCount(impactfulVulnCount);
            
                let counterSSL = 0;
                        for (let i=0; i<res.data.vulnsSSL.length; i++){
                            // console.log(res.data.vulnsSSL[i].info.severity)
                            if (res.data.vulnsSSL[i].info.severity !== "foo"){
                                counterSSL++;
                            }
                            if (res.data.vulnsSSL[i].info.severity !== "foo" && res.data.vulnsSSL[i].info.severity !== "info"){
                                console.log(res.data.vulnsSSL[i].info.severity)
                                setImpactfulVulnFoundSSL(true);
                            }
                        }
                        setImpactfulVulnCountSSL(counterSSL);
                        let counterFile = 0;
                        for (let i=0; i<res.data.vulnsFile.length; i++){
                            if (res.data.vulnsFile[i].info.severity !== "foo"){
                                counterFile++;
                            }
                            if (res.data.vulnsFile[i].info.severity !== "foo" && res.data.vulnsFile[i].info.severity !== "info"){
                                console.log(res.data.vulnsFile[i].info.severity)
                                setImpactfulVulnFoundFile(true);
                            }
                        }
                        setImpactfulVulnCountFile(counterFile);
                        let counterDNS = 0;
                        for (let i=0; i<res.data.vulnsDNS.length; i++){
                            if (res.data.vulnsDNS[i].info.severity !== "foo"){
                                counterDNS++;
                            }
                            if (res.data.vulnsDNS[i].info.severity !== "foo" && res.data.vulnsDNS[i].info.severity !== "info"){
                                console.log(res.data.vulnsDNS[i].info.severity)
                                setImpactfulVulnFoundDNS(true);
                            }
                        }
                        setImpactfulVulnCountDNS(counterDNS);
                        let counterVulns = 0;
                        for (let i=0; i<res.data.vulnsVulns.length; i++){
                            if (res.data.vulnsVulns[i].info.severity !== "foo"){
                                counterVulns++;
                            }
                            if (res.data.vulnsVulns[i].info.severity !== "foo" && res.data.vulnsVulns[i].info.severity !== "info"){
                                console.log(res.data.vulnsVulns[i].info.severity)
                                setImpactfulVulnFoundVulns(true);
                            }
                        }
                        setImpactfulVulnCountVulns(counterVulns);
                        let counterTech = 0;
                        for (let i=0; i<res.data.vulnsTech.length; i++){
                            if (res.data.vulnsTech[i].info.severity !== "foo"){
                                counterTech++;
                            }
                            if (res.data.vulnsTech[i].info.severity !== "foo" && res.data.vulnsTech[i].info.severity !== "info"){
                                console.log(res.data.vulnsTech[i].info.severity)
                                setImpactfulVulnFoundTech(true);
                            }
                        }
                        setImpactfulVulnCountTech(counterTech);
                        let counterMisconfig = 0;
                        for (let i=0; i<res.data.vulnsMisconfig.length; i++){
                            if (res.data.vulnsMisconfig[i].info.severity !== "foo"){
                                counterMisconfig++;
                            }
                            if (res.data.vulnsMisconfig[i].info.severity !== "foo" && res.data.vulnsMisconfig[i].info.severity !== "info"){
                                console.log(res.data.vulnsMisconfig[i].info.severity)
                                setImpactfulVulnFoundMisconfig(true);
                            }
                        }
                        setImpactfulVulnCountMisconfig(counterMisconfig);
                        let counterCVEs = 0;
                        for (let i=0; i<res.data.vulnsCVEs.length; i++){
                            if (res.data.vulnsCVEs[i].info.severity !== "foo"){
                                counterCVEs++;
                            }
                            if (res.data.vulnsCVEs[i].info.severity !== "foo" && res.data.vulnsCVEs[i].info.severity !== "info"){
                                console.log(res.data.vulnsCVEs[i].info.severity)
                                setImpactfulVulnFoundCVEs(true);
                            }
                        }
                        setImpactfulVulnCountCVEs(counterCVEs);
                        let counterCNVD = 0;
                        for (let i=0; i<res.data.vulnsCNVD.length; i++){
                            if (res.data.vulnsCNVD[i].info.severity !== "foo"){
                                counterCNVD++;
                            }
                            if (res.data.vulnsCNVD[i].info.severity !== "foo" && res.data.vulnsCNVD[i].info.severity !== "info"){
                                console.log(res.data.vulnsCNVD[i].info.severity)
                                setImpactfulVulnFoundCNVD(true);
                            }
                        }
                        setImpactfulVulnCountCNVD(counterCNVD);
                        let counterExposed = 0;
                        for (let i=0; i<res.data.vulnsExposed.length; i++){
                            if (res.data.vulnsExposed[i].info.severity !== "foo"){
                                counterExposed++;
                            }
                            if (res.data.vulnsExposed[i].info.severity !== "foo" && res.data.vulnsExposed[i].info.severity !== "info"){
                                console.log(res.data.vulnsExposed[i].info.severity)
                                setImpactfulVulnFoundExposed(true);
                            }
                        }
                        setImpactfulVulnCountExposed(counterExposed);
                        let counterExposure = 0;
                        for (let i=0; i<res.data.vulnsExposure.length; i++){
                            if (res.data.vulnsExposure[i].info.severity !== "foo"){
                                counterExposure++;
                            }
                            if (res.data.vulnsExposure[i].info.severity !== "foo" && res.data.vulnsExposure[i].info.severity !== "info"){
                                console.log(res.data.vulnsExposure[i].info.severity)
                                setImpactfulVulnFoundExposure(true);
                            }
                        }
                        setImpactfulVulnCountExposure(counterExposure);
                        let counterMisc = 0;
                        for (let i=0; i<res.data.vulnsMisc.length; i++){
                            if (res.data.vulnsMisc[i].info.severity !== "foo"){
                                counterMisc++;
                            }
                            if (res.data.vulnsMisc[i].info.severity !== "foo" && res.data.vulnsMisc[i].info.severity !== "info"){
                                console.log(res.data.vulnsMisc[i].info.severity)
                                setImpactfulVulnFoundMisc(true);
                            }
                        }
                        setImpactfulVulnCountMisc(counterMisc);
                        let counterNetwork = 0;
                        for (let i=0; i<res.data.vulnsNetwork.length; i++){
                            if (res.data.vulnsNetwork[i].info.severity !== "foo"){
                                counterNetwork++;
                            }
                            if (res.data.vulnsNetwork[i].info.severity !== "foo" && res.data.vulnsNetwork[i].info.severity !== "info"){
                                console.log(res.data.vulnsNetwork[i].info.severity)
                                setImpactfulVulnFoundNetwork(true);
                            }
                        }
                        setImpactfulVulnCountNetwork(counterNetwork);
                        let counterRs0n = 0;
                        for (let i=0; i<res.data.vulnsRs0n.length; i++){
                            if (res.data.vulnsRs0n[i].info.severity !== "foo"){
                                counterRs0n++;
                            }
                            if (res.data.vulnsRs0n[i].info.severity !== "foo" && res.data.vulnsRs0n[i].info.severity !== "info"){
                                console.log(res.data.vulnsRs0n[i].info.severity)
                                setImpactfulVulnFoundRs0n(true);
                            }
                        }
                        setImpactfulVulnCountRs0n(counterRs0n);
                        let counterHeadless = 0;
                        for (let i=0; i<res.data.vulnsHeadless.length; i++){
                            if (res.data.vulnsHeadless[i].info.severity !== "foo"){
                                counterHeadless++;
                            }
                            if (res.data.vulnsHeadless[i].info.severity !== "foo" && res.data.vulnsHeadless[i].info.severity !== "info"){
                                console.log(res.data.vulnsHeadless[i].info.severity)
                                setImpactfulVulnFoundHeadless(true);
                            }
                        }
                        setImpactfulVulnCountHeadless(counterHeadless);
                }
          })          
    }, [props])

    console.log(`Nombre de vulnérabilités significatives : ${impactfulVulnCount} -- Total de vulnérabilités : ${vulnCount}`);

    return (
        <div className="bg-secondary dashboard">
            <div className="row pl-5">
                <div className="col-4 mb-4">
                    <h4>FQDN : <a href={"https://" + thisFqdn.fqdn}>{thisFqdn.fqdn}</a></h4>
                </div>
                <div className="col-4 mb-4">
                    {
                        thisFqdn.targetUrls.length > 0 ? <h4>URL cible : {thisFqdn.targetUrls[0]}</h4> : <h4>URL cible : Aucune</h4>
                    }
                </div>
                <div className="col-4 mb-4">
                    <h4>Dernière mise à jour : {formatUpdated}</h4>
                </div>
            </div>
            <div className="row ml-5 pl-5">
                <div className="col-2">
                    <h4>Nombre de sous-domaines</h4>
                    <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                        <li style={{paddingTop:"10px", paddingBottom:"10px", fontSize:"20px", fontWeight:"bold"}}>Amass: {thisFqdn.recon.subdomains.amass.length}</li>
                        <h5 style={{paddingTop:"10px", fontWeight:"600"}}>Collecte web</h5>
                        <li>Sublist3r: {thisFqdn.recon.subdomains.sublist3r.length}</li>
                        <li>Assetfinder: {thisFqdn.recon.subdomains.assetfinder.length}</li>
                        <li>GetAllUrls (GAU): {thisFqdn.recon.subdomains.gau.length}</li>
                        <li>Journaux de transparence des certificats (CTL): {thisFqdn.recon.subdomains.ctl.length}</li>
                        <li>Subfinder: {thisFqdn.recon.subdomains.subfinder.length}</li>
                        <h5 style={{paddingTop:"10px", fontWeight:"600"}}>Force brute</h5>
                        <li>ShuffleDNS Standard: {thisFqdn.recon.subdomains.shuffledns.length}</li>
                        <li>ShuffleDNS CeWL: {thisFqdn.recon.subdomains.shufflednsCustom.length}</li>
                        <h5 style={{paddingTop:"10px", fontWeight:"600"}}>Découverte de liens et de JavaScript</h5>
                        <li>GoSpider: {thisFqdn.recon.subdomains.gospider.length}</li>
                        <li>Subdomainizer: {thisFqdn.recon.subdomains.subdomainizer.length}</li>
                        <h5 style={{paddingTop:"10px", fontWeight:"600"}}>Favicon et marketing</h5>
                    </ul>
                </div>
                <div className="col-3">
                    {
                    thisFqdn.recon.subdomains.consolidatedNew.length < thisFqdn.recon.subdomains.consolidated.length ?
                    <h5>Sous-domaines (Nouveaux : {thisFqdn.recon.subdomains.consolidatedNew.length}/{thisFqdn.recon.subdomains.consolidated.length})</h5> :
                    <h5>Sous-domaines (Nouveaux : {thisFqdn.recon.subdomains.consolidated.length}/{thisFqdn.recon.subdomains.consolidated.length})</h5>
                    }
                    <div style={{width: '400px', height: '500px', padding: '5px', border: '1px solid black', overflowY: 'scroll'}}>
                        {
                            thisFqdn.recon.subdomains.consolidated.sort().map((subdomain, i) => {
                                return (
                                    thisFqdn.recon.subdomains.consolidatedNew.includes(subdomain) ?
                                    <a style={{display: "block", color: "red"}} href={"https://" + subdomain} key={i} target="_blank" rel="noreferrer">{subdomain}</a> :
                                    <a style={{display: "block"}} href={"https://" + subdomain} key={i} target="_blank" rel="noreferrer">{subdomain}</a>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="col-3 ml-3">
                    <h5>URL actives : (Nouvelles : {thisFqdn.recon.subdomains.httprobeAdded.length}/{thisFqdn.recon.subdomains.httprobe.length})</h5>
                    <div style={{width: '400px', height: '500px', padding: '5px', border: '1px solid black', overflowY: 'scroll'}}>
                        {
                            thisFqdn.recon.subdomains.httprobe.sort().map((server, i) => {
                                return (
                                        thisFqdn.recon.subdomains.httprobeAdded.includes(server) ?
                                        <a style={{display: "block", color: "red"}} key={i} href={server} target="_blank" rel="noreferrer">{server}</a> :
                                        <a style={{display: "block"}} key={i} href={server} target="_blank" rel="noreferrer">{server}</a>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="col-3 ml-3">
                    <h5>Vulnérabilités Nuclei significatives : {impactfulVulnCount}/{vulnCount}</h5>
                    <ul style={{listStyleType:"none"}}> 
                        <li className="mt-4" onClick={(e)=>setCurrentStep(0)}>Complet (Nombre de vulnérabilités : {impactfulVulnCountFull})</li>
                        {
                            impactfulVulnFoundSSL ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(1)}>SSL (Nombre de vulnérabilités : {impactfulVulnCountSSL})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(1)}>SSL (Nombre de vulnérabilités : {impactfulVulnCountSSL})</li> 
                        }
                        {
                            impactfulVulnFoundFile ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(2)}>Fichiers (Nombre de vulnérabilités : {impactfulVulnCountFile})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(2)}>Fichiers (Nombre de vulnérabilités : {impactfulVulnCountFile})</li>
                        }
                        {
                            impactfulVulnFoundDNS ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(3)}>DNS (Nombre de vulnérabilités : {impactfulVulnCountDNS})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(3)}>DNS (Nombre de vulnérabilités : {impactfulVulnCountDNS})</li>
                        }
                        {
                            impactfulVulnFoundVulns ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(4)}>Vulnérabilités (Nombre de vulnérabilités : {impactfulVulnCountVulns})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(4)}>Vulnérabilités (Nombre de vulnérabilités : {impactfulVulnCountVulns})</li>
                        }
                        {
                            impactfulVulnFoundTech ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(5)}>Technologies (Nombre de vulnérabilités : {impactfulVulnCountTech})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(5)}>Technologies (Nombre de vulnérabilités : {impactfulVulnCountTech})</li>
                        }
                        {
                            impactfulVulnFoundMisconfig ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(6)}>Mauvaises configurations (Nombre de vulnérabilités : {impactfulVulnCountMisconfig})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(6)}>Mauvaises configurations (Nombre de vulnérabilités : {impactfulVulnCountMisconfig})</li>
                        }
                        {
                            impactfulVulnFoundCVEs ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(7)}>CVE (Nombre de vulnérabilités : {impactfulVulnCountCVEs})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(7)}>CVE (Nombre de vulnérabilités : {impactfulVulnCountCVEs})</li>
                        }
                        {
                            impactfulVulnFoundCNVD ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(8)}>CNVD (Nombre de vulnérabilités : {impactfulVulnCountCNVD})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(8)}>CNVD (Nombre de vulnérabilités : {impactfulVulnCountCNVD})</li>
                        }
                        {
                            impactfulVulnFoundExposed ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(9)}>Services exposés (Nombre de vulnérabilités : {impactfulVulnCountExposed})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(9)}>Services exposés (Nombre de vulnérabilités : {impactfulVulnCountExposed})</li>
                        }
                        {
                            impactfulVulnFoundExposure ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(10)}>Surface exposée (Nombre de vulnérabilités : {impactfulVulnCountExposure})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(10)}>Surface exposée (Nombre de vulnérabilités : {impactfulVulnCountExposure})</li>
                        }
                        {
                            impactfulVulnFoundMisc ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(11)}>Divers (Nombre de vulnérabilités : {impactfulVulnCountMisc})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(11)}>Divers (Nombre de vulnérabilités : {impactfulVulnCountMisc})</li>
                        }
                        {
                            impactfulVulnFoundNetwork ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(12)}>Réseau (Nombre de vulnérabilités : {impactfulVulnCountNetwork})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(12)}>Réseau (Nombre de vulnérabilités : {impactfulVulnCountNetwork})</li>
                        }
                        {
                            impactfulVulnFoundRs0n ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(13)}>Rs0n (Nombre de vulnérabilités : {impactfulVulnCountRs0n})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(13)}>Rs0n (Nombre de vulnérabilités : {impactfulVulnCountRs0n})</li>
                        }
                        {
                            impactfulVulnFoundHeadless ?
                            <li className="mt-2" style={{color:"red"}} onClick={(e)=>setCurrentStep(14)}>Sans interface (Nombre de vulnérabilités : {impactfulVulnCountHeadless})</li> :
                            <li className="mt-2" onClick={(e)=>setCurrentStep(14)}>Sans interface (Nombre de vulnérabilités : {impactfulVulnCountHeadless})</li>
                        }
                    </ul>
                </div>
            </div>
            <div className="row ml-5 pl-5">
            <div className="col-12 mt-3">
                    <h5>Cartographie de l'infrastructure</h5>
                    <div style={{width: '1500px', height: '600px', padding: '5px', border: '1px solid black', overflowY: 'scroll'}}>
                        {
                            thisFqdn.asns.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                            <li key={i}>{record}
                                            {
                                                thisFqdn.isps.filter(isp => isp.includes(record.split(" --> ")[0])).map((isp, q) => {
                                                    return (
                                                        <span> -- ({isp.split(" --> ")[2]})</span>
                                                    )
                                                })
                                            }
                                                <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                                    {
                                                        thisFqdn.subnets.sort().filter(subnet => subnet.includes(record.split(" ")[5])).map((subnet, j) => (
                                                            <li style={{paddingLeft:"100px"}} key={j}>{subnet}
                                                                <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                                                    {
                                                                        thisFqdn.dns.arecord.concat(thisFqdn.dns.aaaarecord).sort().filter(tempRecord => tempRecord.split(" ")[5] === subnet.split(" ")[5]).map((tempRecord, k) => (
                                                                            <li style={{paddingLeft:"100px"}} key={k}>{tempRecord} --- LIEN : <a href={"https://" + tempRecord.split(" ")[0]} target="_blank" rel="noreferrer">{"https://" + tempRecord.split(" ")[0]}</a></li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                                <br></br>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        <div className="row ml-5 pl-5">
            <div className="col-12 mt-3">
                <h5>Vulnérabilités Nuclei significatives : {impactfulVulnCount}/{vulnCount}</h5>
                <div style={{width: '1500px', height: '300px', padding: '5px', border: '1px solid black', overflowY: 'scroll', overflowX: 'hidden'}}>
                    {
                        impactfulVulnArray.sort().map((vuln, i) => {
                            return (
                                <div key={i}>
                                    <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}>{vuln.info.name} --{'>'} <a href={"https://" + vuln.host} target="_blank" rel="noreferrer">{vuln.host}</a> ({vuln.info.severity.toUpperCase()}) --- Preuve : <a href={"https://" + vuln['matched-at']} target="_blank" rel="noreferrer">{vuln['matched-at']}</a> ({vuln.ip})</li>
                                    </ul>
                                </div>
                            )
                        })
                    }
                </div>
                </div>
            </div>
            <div className="row ml-5 pl-5">
                <div className="col-12 mt-3">
                    <h5>Services cloud</h5>
                    <div style={{width: '1500px', height: '300px', padding: '5px', border: '1px solid black', overflowY: 'scroll'}}>
                        {
                            thisFqdn.aws.s3.sort().map((bucket, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                            <li>Bucket S3 : {bucket['domain']}</li>
                                            {
                                                bucket['public'] ?
                                                <li style={{paddingLeft: "30px"}}>BUCKET S3 PUBLIC</li> :
                                                ""
                                            }
                                            {
                                                bucket['downloadExploit'] ?
                                                <li style={{paddingLeft: "30px"}}>TÉLÉCHARGEMENT DE FICHIERS POSSIBLE</li> :
                                                ""
                                            }
                                            {
                                                bucket['uploadExploit'] ?
                                                <li style={{paddingLeft: "30px"}}>ENVOI DE FICHIERS POSSIBLE</li> :
                                                ""
                                            }
                                            {
                                                bucket['authenticated'] ?
                                                <li style={{paddingLeft: "30px"}}>AUTHENTIFICATION AWS PAR DÉFAUT</li> :
                                                ""
                                            }
                                            {
                                                bucket['subdomainTakeover'] ?
                                                <li style={{paddingLeft: "30px"}}>POTENTIEL HACK DE SOUS-DOMAINE</li> :
                                                ""
                                            }
                                            <li style={{paddingLeft: "30px"}}>Fichiers :</li>
                                            <ul style={{listStyleType:"none", paddingLeft:"60px", margin:"0"}}>
                                                {
                                                    bucket['files'].map((file, i) => {
                                                        return (
                                                            <li>{file}</li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.aws.ec2.sort().map((ec2, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li>{ec2}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.aws.cloudfront.sort().map((cloudfront, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li>{cloudfront}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                                                {
                            thisFqdn.aws.elb.sort().map((elb, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li>{elb}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                                                {
                            thisFqdn.aws.documentdb.sort().map((documentdb, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li>{documentdb}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.aws.api_gateway.sort().map((api_gateway, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                            <li>{api_gateway}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.aws.elasticbeanstalk.sort().map((elasticbeanstalk, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li>{elasticbeanstalk}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            
            <div className="row ml-5 pl-5">
                <div className="col-12 mt-3">
                    <h5>DNS Records</h5>
                    <div style={{width: '1500px', height: '300px', padding: '5px', border: '1px solid black', overflowY: 'scroll'}}>
                        {
                            thisFqdn.dns.cnamerecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                            <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.dns.node.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.dns.arecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                                                {
                            thisFqdn.dns.aaaarecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                                                {
                            thisFqdn.dns.mxrecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.dns.nsrecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.dns.ptrrecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.dns.soarecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.dns.spfrecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.dns.srvrecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                        {
                            thisFqdn.dns.txtrecord.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                        <li key={i}><a href={"https://" + record.split(" ")[0]} target="_blank" rel="noreferrer">{record.split(" ")[0]} </a>{record.replace(record.split(" ")[0], '').replace(record.split(" ")[5], '')}<a href={"https://" + record.split(" ")[5]} target="_blank" rel="noreferrer"> {record.split(" ")[5]}</a></li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="row ml-5 pl-5">
            <div className="col-6 mt-3">
                    <h5>Numéros d'AS</h5>
                    <div style={{width: '600px', height: '300px', padding: '5px', border: '1px solid black', overflowY: 'scroll'}}>
                        {
                            thisFqdn.asns.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                            <li key={i}>{record}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="col-6 mt-3">
                    <h5>Sous-réseaux</h5>
                    <div style={{width: '600px', height: '300px', padding: '5px', border: '1px solid black', overflowY: 'scroll'}}>
                        {
                            thisFqdn.subnets.sort().map((record, i) => {
                                return (
                                    <div key={i}>
                                        <ul style={{listStyleType:"none", padding:"0", margin:"0"}}>
                                            <li key={i}>{record}</li>
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Dashboard;