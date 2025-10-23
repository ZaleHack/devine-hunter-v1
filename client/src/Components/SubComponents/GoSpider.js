import axios from 'axios';import React, {useState, useEffect} from 'react';

import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const GoSpider = props => {
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
                    const tempArr = res.data.recon.subdomains.gospider;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.gospider)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addGoSpiderData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.gospider = list.split("\n");
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.gospider)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteGoSpiderData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.gospider = [];
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.gospider)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b>GoSpider est un crawler web très rapide écrit en Go, idéal pour explorer une application et recenser ses chemins publics.</p>
                    <p><b>Objectif&nbsp;:</b> Recenser les sous-domaines du FQDN étudié pour compléter la vue d’ensemble de l’application.</p>
                    <p><b>Téléchargement&nbsp;:</b><span onClick={notify}>go get -u github.com/jaeles-project/gospider</span></p>
                    <p><b>Installation&nbsp;:</b><span onClick={notify}>apt-get install golang</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>gospider -s "https://{props.thisFqdn.fqdn}/" -o gospider.{props.thisFqdn.fqdn}.txt -c 10 -d 1; cat gospider.{props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p>
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="gospider" formFunction={addGoSpiderData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteGoSpiderData} subdomainList={subdomainList} thisScanner="gospider"/>
                }
            </div>
        </div>
    )
}

export default GoSpider;