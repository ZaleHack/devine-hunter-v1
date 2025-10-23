import React from 'react';

import toast, { Toaster } from 'react-hot-toast';

const SubDomainResults = props => {

    const deleteSubdomains = (e) => {
        props.resultsFunction();
    }

    const resultsStyle = {
        height: '400px',
        width: '1200px',
        overflowY: 'scroll',
        border: '1px solid black',
        padding: '10px'
    }

    const notify = (e) => {
        let copyString = "";
        props.subdomainList.map((fqdn, i)=>{
            return (copyString += fqdn + "\n")
        })
        navigator.clipboard.writeText(copyString);
        toast(`Liste des sous-domaines copiée dans le presse-papiers`);
    }

    return (
        <div className="row mt-1">
            <Toaster position="top-right" />
            <div className="col-12">
                <h5>Résultats ({props.subdomainList.length}) :</h5>
                <div style={resultsStyle}>
                {
                    props.subdomainList.map((subdomain, i)=>{
                        if (subdomain.substring(0,4) === "http") {
                            return (
                                <p key={i} style={{marginBottom:'1px', marginLeft:'15px'}}><a href={subdomain} target="_blank" rel="noreferrer">{subdomain}</a></p>
                            )
                        } else {
                            return (
                                <p key={i} style={{marginBottom:'1px', marginLeft:'15px'}}><a href={'http://' + subdomain} target="_blank" rel="noreferrer">{subdomain}</a></p>
                            )
                        }
                    })
                }
                </div>
            </div>
            <div className="col-4 mt-2">
                <button className="btn btn-primary" onClick={deleteSubdomains}>Supprimer</button>
                <button className="btn btn-primary ml-5" onClick={notify}>Copier</button>
            </div>
        </div>
    )
}

export default SubDomainResults;