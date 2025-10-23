import axios from 'axios';import React, {useState, useEffect} from 'react';

import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const Dnmasscan = props => {
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
                    const tempArr = res.data.recon.subdomains.masscan;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.masscan)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addDnmasscanData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.masscan = list.split("\n");
        axios.post('http://localhost:8000/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.masscan)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteDnmasscanData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.masscan = [];
        axios.post('http://localhost:8000/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.masscan)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-12">
                        <Toaster />
                    <p><b>Détails&nbsp;:</b>Dnmasscan est un script Bash qui automatise la résolution d’une liste de domaines puis leur scan avec masscan. Comme masscan n’accepte pas directement les noms de domaine, un fichier temporaire consigne les correspondances IP/domaine pour consultation après l’exécution.</p>
                    <p><b>Objectif&nbsp;:</b> À partir de la liste consolidée des sous-domaines, identifier un maximum de serveurs actifs et réaliser un scan complet des ports.</p>
                    <p><b>Téléchargement&nbsp;:</b><span onClick={notify}>https://github.com/rastating/dnmasscan.git</span></p>
                    <p><b>Installation&nbsp;:</b><span onClick={notify}>sudo apt-get --assume-yes install git make gcc; git clone https://github.com/robertdavidgraham/masscan; cd masscan; make; make install;</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>sudo ./dnmasscan /tmp/dnmasscan.tmp /tmp/dns.log -p1-65535 --rate=500 | xclip -i -selection clipboard</span></p>
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="masscan" formFunction={addDnmasscanData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteDnmasscanData} subdomainList={subdomainList} thisScanner="masscan"/>
                }
            </div>
        </div>
    )
}

export default Dnmasscan;