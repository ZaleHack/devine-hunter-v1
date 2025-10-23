import React, {useState, useEffect} from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import SubDomainResults from '../HelperComponents/SubDomainResults';
import SubDomainForm from '../HelperComponents/SubDomainForm';

const Ctl = props => {
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
                    const tempArr = res.data.recon.subdomains.ctl;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.ctl)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props.thisFqdn._id])
    


    const addCtlData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.ctl = list.split("\n");
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.ctl)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteCtlData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.ctl = [];
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.ctl)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b>Interroge la base de données de crt.sh (Certificate Transparency) afin d’extraire les sous-domaines associés au domaine cible.</p>
                    <p><b>Objectif&nbsp;:</b> Recenser les sous-domaines du FQDN étudié pour compléter la vue d’ensemble de l’application.</p>
                    <p><b>Téléchargement / installation&nbsp;:</b><span onClick={notify}>git clone https://github.com/hannob/tlshelpers.git</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>sudo ./getsubdomain {props.thisFqdn.fqdn} | xclip -i -selection clipboard</span></p>
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="ctl" formFunction={addCtlData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteCtlData} subdomainList={subdomainList} thisScanner="ctl"/>
                }
            </div>
        </div>
    )
}

export default Ctl;