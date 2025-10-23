import React, {useState, useEffect} from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import SubDomainResults from '../HelperComponents/SubDomainResults';
import SubDomainForm from '../HelperComponents/SubDomainForm';

const Assetfinder = props => {
    const [formCompleted, setFormCompleted] = useState(false);
    const [subdomainList, setSubdomainList] = useState([])
    const [loaded, setLoaded] = useState(false);



    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }

    useEffect(()=>{
        axios.post('/api/fqdn', {_id:props.thisFqdn._id})
            .then(res=>{
                if (res.data !== null){
                    const tempArr = res.data.recon.subdomains.assetfinder;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.assetfinder)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props.thisFqdn._id])
    


    const addAssetfinderData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.assetfinder = list.split("\n");
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.assetfinder)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteAssetfinderData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.assetfinder = [];
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.assetfinder)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b>Assetfinder inventorie rapidement les domaines et sous-domaines potentiellement liés à un domaine donné (selon la fameuse concision de Tomnomnom&nbsp;!).</p>
                    <p><b>Objectif&nbsp;:</b> Recenser les sous-domaines du FQDN étudié pour compléter la vue d’ensemble de l’application.</p>
                    <p><b>Téléchargement / installation&nbsp;:</b><span onClick={notify}>go get -u github.com/tomnomnom/assetfinder</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>sudo assetfinder --subs-only {props.thisFqdn.fqdn} &gt; assetfinder.{props.thisFqdn.fqdn}.txt; cat assetfinder.{props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p>
                </div>
            </div>
            <div className="row">
            {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="assetfinder" formFunction={addAssetfinderData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteAssetfinderData} subdomainList={subdomainList} thisScanner="assetfinder"/>
                }
            </div>
        </div>
    )
}

export default Assetfinder;