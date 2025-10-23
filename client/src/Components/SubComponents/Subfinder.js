import axios from 'axios';import React, {useState, useEffect} from 'react';

import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const Subfinder = props => {
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
                    const tempArr = res.data.recon.subdomains.subfinder;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.subfinder)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addSubfinderData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.subfinder = list.split("\n");
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.subfinder)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteSubfinderData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.subfinder = [];
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.subfinder)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-1">
            <div className="row">
                <div className="col-12">
                    <p><b>Détails&nbsp;:</b>Subfinder est un outil d’énumération passive des sous-domaines. Sa structure modulaire et optimisée offre une collecte rapide à partir de sources en ligne accessibles publiquement.</p>
                    <p><b>Objectif&nbsp;:</b> Recenser les sous-domaines du FQDN étudié pour compléter la vue d’ensemble de l’application.</p>
                    <p><b>Téléchargement&nbsp;:</b><span onClick={notify}>GO111MODULE=on go get -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder</span></p>
                    <p><b>Installation&nbsp;:</b> Après l’installation de base, certaines sources nécessitent des clés API à renseigner dans le fichier <code>$HOME/.config/subfinder/config.yaml</code> (créé lors du premier lancement). Le fichier YAML peut contenir plusieurs clés par service&nbsp;; l’outil choisira automatiquement l’une d’elles pour l’énumération. Pour les sources comme Censys ou PassiveTotal, ajoutez plusieurs clés en les séparant par un deux-points (:).</p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>./subfinder -d {props.thisFqdn.fqdn} -o subfinder.{props.thisFqdn.fqdn}.txt; cat subfinder.{props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p>
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="subfinder" formFunction={addSubfinderData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteSubfinderData} subdomainList={subdomainList} thisScanner="subfinder"/>
                }
            </div>
        </div>
    )
}

export default Subfinder;