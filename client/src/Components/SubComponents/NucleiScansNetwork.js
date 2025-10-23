import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NucleiScans = props => {
    const [vulnList, setVulnList] = useState([]);
    const [currentVuln, setCurrentVuln] = useState(0);

    useEffect(()=>{
        axios.post('/api/fqdn', {_id:props.thisFqdn._id})
            .then(res=>{
                if (res.data !== null){
                    const tempArr = res.data.vulnsNetwork || [];
                    setVulnList(tempArr);
                    setCurrentVuln(0);
                } else {
                    setVulnList([]);
                }
            })
    }, [props.thisFqdn._id])

    return (
        <div className="container mt-3 pl-0 ml-0">
            <div className="row" style={{width:'1200px'}}>
                <div className="col-3" style={{height:'750px', overflowY:'scroll'}}>
                    <ul>
                    {
                        vulnList.sort((a, b) => {return a.impactful ? -1 : 1}).map((vuln, i)=>{
                            return (
                                vuln.info.severity !== "info" ? <li key={i} style={{listStyleType:"none", color:"red"}} onClick={(e)=>setCurrentVuln(i)}>{vuln.info.name}</li> 
                                : <li key={i} style={{listStyleType:"none"}} onClick={(e)=>setCurrentVuln(i)}>{vuln.info.name}</li>
                            )
                        })
                    }
                    </ul>
                </div>
                <div className="col-9" style={{height:'750px', overflowY:'scroll'}}>
                    <ul>
                    {
                        vulnList.filter(vuln => vulnList.indexOf(vuln) === currentVuln).map(filteredVuln => (
                            <>
                            <p><b>Nom&nbsp;:</b> {filteredVuln.info.name}</p>
                            <p><b>ID du modèle&nbsp;:</b> {filteredVuln['template-id']}</p>
                            <p><b>Étiquettes&nbsp;:</b> {filteredVuln.info.tags?.length > 0 ? filteredVuln.info.tags.map((tag) => <>{tag}&nbsp;&nbsp;</>) : <>Aucune étiquette</>}</p>
                            <p><b>Sévérité&nbsp;:</b> {filteredVuln.info.severity}</p>
                            <p><b>Description&nbsp;:</b> {filteredVuln.info.description}</p>
                            <p><b>Hôte&nbsp;:</b> <a href={"http://" + filteredVuln.host} target="_blank" rel="noreferrer">{filteredVuln.host}</a></p>
                            <p><b>Correspondance&nbsp;:</b> <a href={filteredVuln['matched-at']} target="_blank" rel="noreferrer">{filteredVuln['matched-at']}</a></p>
                            <p><b>Type de correspondance&nbsp;:</b> {filteredVuln['matcher-name']}</p>
                            <p><b>IP&nbsp;:</b> {filteredVuln.ip}</p>
                            <p><b>Résultats extraits&nbsp;:</b> 
                            <ul>
                            {
                                filteredVuln['extracted-results'] && filteredVuln['extracted-results'].length > 0 ? filteredVuln['extracted-results'].map((result, i)=>{
                                    return (
                                        <li key={i} style={{listStyleType:"none"}}>{result}</li>
                                    )
                                }) : <p>Aucun résultat extrait</p>
                            }
                            </ul>   
                            </p>
                            <p><b>Références&nbsp;:</b> 
                            <ul>
                            {
                                filteredVuln.info.reference && filteredVuln.info.reference.length > 0 ? filteredVuln.info.reference.map((reference, i)=>{
                                    return (
                                        <li key={i} style={{listStyleType:"none"}}><a href={reference}  target="_blank" rel="noreferrer">{reference}</a></li>
                                    )
                                }) : <p>Aucune référence</p>
                            }
                            </ul>   
                            </p>
                            <p><b>Commande curl&nbsp;:</b> {filteredVuln['curl-command']}</p>
                            <p><b>Découvert&nbsp;:</b> {filteredVuln.timestamp}</p>
                            </>
                        ))
                    }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NucleiScans;