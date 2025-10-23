import axios from 'axios';import React, {useState, useEffect} from 'react';

import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const Sublist3r = props => {
    const [formCompleted, setFormCompleted] = useState(false);
    const [subdomainList, setSubdomainList] = useState([])
    const [loaded, setLoaded] = useState(false);



    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }

    useEffect(()=>{
        setFormCompleted(false);
        axios.post('/api/fqdn', {_id:props.thisFqdn._id})
            .then(res=>{
                if (res.data !== null){
                    const tempArr = res.data.recon.subdomains.sublist3r;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.sublist3r)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addSublist3rData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.sublist3r = list.split("\n");
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.sublist3r)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteSublist3rData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.sublist3r = [];
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.sublist3r)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> Sublist3r est un outil Python qui énumère les sous-domaines à l’aide de sources OSINT. Il aide les chercheurs en sécurité et les chasseurs de bugs à collecter rapidement les sous-domaines d’un domaine cible en s’appuyant sur de nombreux moteurs de recherche (Google, Yahoo, Bing, Baidu, Ask) ainsi que sur Netcraft, VirusTotal, ThreatCrowd, DNSdumpster et ReverseDNS.</p>
                    <p><b>Objectif&nbsp;:</b> Recenser les sous-domaines valides du FQDN analysé afin d’obtenir une vision complète de la surface d’attaque.</p>
                    <p><b>Téléchargement&nbsp;:</b><span onClick={notify}>sudo git clone https://github.com/aboul3la/Sublist3r.git</span></p>
                    <p><b>Installation&nbsp;:</b><span onClick={notify}>sudo pip install -r requirements.txt</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>sudo python3 sublist3r.py -d {props.thisFqdn.fqdn} -t 50 -o sublist3r.{props.thisFqdn.fqdn}.txt -v; cat sublist3r.{props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p>
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="sublist3r" formFunction={addSublist3rData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteSublist3rData} subdomainList={subdomainList} thisScanner="sublist3r"/>
                }
            </div>
        </div>
    )
}

export default Sublist3r;