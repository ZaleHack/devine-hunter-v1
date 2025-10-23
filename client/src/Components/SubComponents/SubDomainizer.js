import axios from 'axios';import React, {useState, useEffect} from 'react';

import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const SubDomainizer = props => {
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
                    const tempArr = res.data.recon.subdomains.subdomainizer;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.subdomainizer)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addSubDomainizerData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.subdomainizer = list.split("\n");
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.subdomainizer)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteSubDomainizerData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.subdomainizer = [];
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.subdomainizer)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-12">
                        <Toaster />
                    <p><b>Détails&nbsp;:</b>SubDomainizer découvre des sous-domaines et secrets cachés dans les pages web, les dépôts GitHub et les scripts JavaScript associés à une URL. Il repère également les buckets S3 ou URL CloudFront exposés (lecture/écriture, takeover, etc.) et peut analyser un dossier local.</p>
                    <p><b>Objectif&nbsp;:</b> Recenser les sous-domaines du FQDN étudié pour compléter la vue d’ensemble de l’application.</p>
                    <p><b>Téléchargement&nbsp;:</b><span onClick={notify}>git clone https://github.com/nsonaniya2010/SubDomainizer.git</span></p>
                    <p><b>Installation&nbsp;:</b><span onClick={notify}>pip3 install -r requirements.txt</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>python3 SubDomainizer.py -u {props.thisFqdn.fqdn} -o subdomainizer.{props.thisFqdn.fqdn}.txt; cat subdomainizer.{props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p>                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="subdomainizer" formFunction={addSubDomainizerData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteSubDomainizerData} subdomainList={subdomainList} thisScanner="subdomainizer"/>
                }
            </div>
        </div>
    )
}

export default SubDomainizer;