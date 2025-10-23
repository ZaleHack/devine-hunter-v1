import axios from 'axios';import React, {useState, useEffect} from 'react';

import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const CloudRanges = props => {
    const [formCompleted, setFormCompleted] = useState(false);
    const [subdomainList, setSubdomainList] = useState([])
    const [loaded, setLoaded] = useState(false);



    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }

    useEffect(()=>{
        setFormCompleted(false);
        axios.post('http://localhost:8000/api/fqdn', {_id:props.thisFqdn._id})
            .then(res=>{
                if (res.data !== null){
                    const tempArr = res.data.recon.subdomains.cloudRanges;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.cloudRanges)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addCloudRangesData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.cloudRanges = list.split("\n");
        axios.post('http://localhost:8000/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.cloudRanges)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteCloudRangesData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.cloudRanges = [];
        axios.post('http://localhost:8000/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.cloudRanges)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> Cet utilitaire explore proactivement toutes les plages d’adresses IP AWS pour repérer les serveurs exposant le port&nbsp;443, extrait leurs certificats TLS/SSL, puis consigne les résultats dans un JSON exploitable.</p>
                    <p><b>Objectif&nbsp;:</b> Détecter les serveurs hébergés sur AWS et inclus dans le périmètre, mais susceptibles d’avoir été laissés hors des inventaires officiels.</p>
                    <p><b>Téléchargement&nbsp;:</b><span onClick={notify}>https://github.com/R-s0n/Fire_Spreader.git</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>python3 clear_sky.py -d {props.thisFqdn.fqdn}</span></p>
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="cloudRanges" formFunction={addCloudRangesData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteCloudRangesData} subdomainList={subdomainList} thisScanner="cloudRanges"/>
                }
            </div>
        </div>
    )
}

export default CloudRanges;