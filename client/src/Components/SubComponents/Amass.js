import React, {useState, useEffect} from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import SubDomainResults from '../HelperComponents/SubDomainResults';
import SubDomainForm from '../HelperComponents/SubDomainForm';

const Amass = props => {
    const [formCompleted, setFormCompleted] = useState(false);
    const [subdomainList, setSubdomainList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const regex = "{1,3}"



    const notify = e => {
        navigator.clipboard.writeText(e.target.innerText)
        toast(`"${e.target.innerText}" copié dans le presse-papiers`)
    }

    useEffect(()=>{
        axios.post('/api/fqdn', {_id:props.thisFqdn._id})
            .then(res=>{
                if (res.data !== null){
                    const tempArr = res.data.recon.subdomains.amass;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.amass)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props.thisFqdn._id])



    const addAmassData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.amass = list.split("\n");
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.amass)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteAmassData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.amass = [];
        axios.post('/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.amass)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <p><b>Détails&nbsp;:</b> Le projet OWASP Amass cartographie les surfaces d’attaque et découvre des actifs externes grâce à la collecte OSINT et à la reconnaissance active. L’outil est très complet&nbsp;; la liste intégrale des fonctionnalités est disponible <a href="https://github.com/OWASP/Amass/blob/master/doc/tutorial.md" target="_blank" rel="noreferrer">dans la documentation</a>.</p>
                    <p><b>Objectif&nbsp;:</b> Identifier les sous-domaines pertinents du FQDN courant afin d’élargir la cartographie de l’application.</p>
                    <p><b>Téléchargement / Installation&nbsp;:</b><span onClick={notify}>apt-get install amass</span></p>
                    <p><b>Exécution (passive)&nbsp;:</b><span onClick={notify}>amass enum --passive -d {props.thisFqdn.fqdn} -o {props.thisFqdn.fqdn}.txt; cat {props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p>
                    <p><b>Exécution (active)&nbsp;:</b><span onClick={notify}>amass enum -src -ip -brute -min-for-recursive 2 -d {props.thisFqdn.fqdn} -o amass.{props.thisFqdn.fqdn}.txt; cp amass.{props.thisFqdn.fqdn}.txt amass.{props.thisFqdn.fqdn}.full.txt; sed -i -E 's/\[(.*?)\] +//g' amass.{props.thisFqdn.fqdn}.txt; sed -i -E 's/ ([0-9]{regex}\.)[0-9].*//g' amass.{props.thisFqdn.fqdn}.txt; cat amass.{props.thisFqdn.fqdn}.txt | xclip -i -selection clipboard</span></p>
                    <Toaster />
                </div>
            </div>
            <div className="row">
            {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="amass" formFunction={addAmassData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteAmassData} subdomainList={subdomainList} thisScanner="amass"/>                }
            </div>
        </div>
    )
}

export default Amass;