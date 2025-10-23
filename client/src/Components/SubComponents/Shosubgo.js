import axios from 'axios';import React, {useState, useEffect} from 'react';

import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const Shosubgo = props => {
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
                    const tempArr = res.data.recon.subdomains.shosubgo;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.shosubgo)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addShosubgoData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.shosubgo = list.split("\n");
        axios.post('http://localhost:8000/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.shosubgo)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteShosubgoData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.shosubgo = [];
        axios.post('http://localhost:8000/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.shosubgo)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> Petit utilitaire exploitant l’API Shodan pour récupérer rapidement des sous-domaines.</p>
                    <p><b>Objectif&nbsp;:</b> Recenser les sous-domaines du FQDN étudié afin de compléter la cartographie de l’application.</p>
                    <p><b>Téléchargement&nbsp;:</b><span onClick={notify}>git clone https://github.com/pownx/shosubgo.git</span></p>
                    <p><b>Installation&nbsp;:</b><span onClick={notify}>apt-get install golang</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>go run main.go -d {props.thisFqdn.fqdn} -s $shodan_key &gt; shosubgo.{props.thisFqdn.fqdn}.txt;  cat shosubgo.{props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p>
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="shosubgo" formFunction={addShosubgoData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteShosubgoData} subdomainList={subdomainList} thisScanner="shosubgo"/>
                }
            </div>
        </div>
    )
}

export default Shosubgo;