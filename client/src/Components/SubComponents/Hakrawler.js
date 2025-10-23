import axios from 'axios';import React, {useState, useEffect} from 'react';

import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const Hakrawler = props => {
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
                    const tempArr = res.data.recon.subdomains.hakrawler;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.hakrawler)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addHakrawlerData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.hakrawler = list.split("\n");
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.hakrawler)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteHakrawlerData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.hakrawler = [];
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.hakrawler)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> Hakrawler est un crawler écrit en Go qui facilite la découverte rapide des endpoints et ressources d’une application web.</p>
                    <p><b>Objectif&nbsp;:</b> L’outil est conçu pour être chaîné avec d’autres solutions (énumération de sous-domaines, scanners de vulnérabilités) afin d’automatiser les workflows, par exemple&nbsp;: assetfinder target.com | hakrawler | scanner-xss.</p>
                    <p><b>Téléchargement&nbsp;:</b><span onClick={notify}>go get github.com/hakluke/hakrawler</span></p>
                    <p><b>Installation&nbsp;:</b><span onClick={notify}>apt-get install golang</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>cat /tmp/amass.tmp | ./hakrawler -subs -d 3 -u &gt; hakrawler.{props.thisFqdn.fqdn}.txt; cat hakrawler.{props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p> 
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="hakrawler" formFunction={addHakrawlerData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteHakrawlerData} subdomainList={subdomainList} thisScanner="hakrawler"/>
                }
            </div>
        </div>
    )
}

export default Hakrawler;