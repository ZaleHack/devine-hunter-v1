import React, {useState, useEffect} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import GithubSearchForm from '../HelperComponents/GithubSearchForm';
import GithubSearchResults from '../HelperComponents/GithubSearchResults';

const GithubSearch = props => {


    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }
    const [formCompleted, setFormCompleted] = useState(false);

    useEffect(()=>{
        axios.post('http://localhost:8000/api/fqdn', {_id:props.thisFqdn._id})
            .then(res=>{
                const tempArr = res.data.recon.osint.GithubSearch;
                if (tempArr.length > 0){
                    setFormCompleted(true);
                }
            })
    }, [props.thisFqdn._id])



    const thisFormCompleted = (completed) => {
        setFormCompleted(completed);
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b>Ce script Python simple identifie des requêtes GitHub pertinentes pour les chercheurs en sécurité et les bug bounty hunters. Via l’API GitHub, il interroge les dépôts d’une organisation et classe les recherches par volume de résultats afin de repérer du code sensible.</p>
                    <p><b>Objectif&nbsp;:</b> Déterminer les requêtes GitHub les plus prometteuses afin de prioriser les recherches manuelles.</p>
                    <p><b>Téléchargement / installation&nbsp;:</b><span onClick={notify}>git clone https://github.com/R-s0n/Github_Brute-Dork.git</span></p>
                    <p><b>Exécution (survol&nbsp;– 170 résultats)&nbsp;:</b><span onClick={notify}>python github_brutedork.py -o {props.thisFqdn.fqdn} -u [UTILISATEUR GITHUB] -t [JETON D’ACCÈS PERSONNEL]</span></p>
                    <p><b>Exécution (approfondie&nbsp;– 1 760 résultats)&nbsp;:</b><span onClick={notify}>python github_brutedork.py -o {props.thisFqdn.fqdn} -u [UTILISATEUR GITHUB] -t [JETON D’ACCÈS PERSONNEL] -d</span></p>
                </div>
            </div>
            <div className="row">
                {
                    formCompleted === false ?
                    <GithubSearchForm thisFqdn={props.thisFqdn} thisFormCompleted={thisFormCompleted} /> :
                    <GithubSearchResults thisFqdn={props.thisFqdn} thisFormCompleted={thisFormCompleted} />
                }
            </div>
        </div>
    )
}

export default GithubSearch;