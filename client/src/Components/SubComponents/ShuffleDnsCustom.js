import React, {useState, useEffect} from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import SubDomainForm from '../HelperComponents/SubDomainForm';
import SubDomainResults from '../HelperComponents/SubDomainResults';


const ShuffleDnsCustom = props => {
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
                    const tempArr = res.data.recon.subdomains.shufflednsCustom;
                    if (tempArr.length > 0){
                        setSubdomainList(res.data.recon.subdomains.shufflednsCustom)
                        setFormCompleted(true);
                    }
                }
                setLoaded(true);
            })
    }, [props])
    


    const addShuffleDnsCustomData = (list) => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.shufflednsCustom = list.split("\n");
        axios.post('http://localhost:8000/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.shufflednsCustom)
                setFormCompleted(true);
            })
            .catch(err=>console.log(err));
    }

    const deleteShuffleDnsCustomData = () => {
        const tempFqdn = props.thisFqdn;
        tempFqdn.recon.subdomains.shufflednsCustom = [];
        axios.post('http://localhost:8000/api/fqdn/update', tempFqdn)
            .then(res=>{
                setSubdomainList(res.data.recon.subdomains.shufflednsCustom)
                setFormCompleted(false);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <Toaster />
                    <p><b>Détails&nbsp;:</b> ShuffleDNS est une surcouche de massdns écrite en Go qui combine résolution rapide et bruteforce actif des sous-domaines, tout en gérant les wildcards et un format d’entrée/sortie souple.</p>
                    <p><b>Objectif&nbsp;:</b> Lancer un bruteforce ciblé des sous-domaines à partir d’une wordlist personnalisée.</p>
                    <p><b>Téléchargement / installation&nbsp;:</b><span onClick={notify}>GO111MODULE=on go get -v github.com/projectdiscovery/shuffledns/cmd/shuffledns</span></p>
                    <p><b>Exécution&nbsp;:</b><span onClick={notify}>~/go/bin/shuffledns -d {props.thisFqdn.fqdn} -w ~/Wordlists/custom.txt -r ~/Wordlists/resolvers.txt | xclip -i -selection clipboard</span></p>
                </div>
            </div>
            <div className="row">
                {
                    loaded && formCompleted === false ?
                    <SubDomainForm thisFqdn={props.thisFqdn} thisScanner="shufflednsCustom" formFunction={addShuffleDnsCustomData}/> :
                    <SubDomainResults thisFqdn={props.thisFqdn} resultsFunction={deleteShuffleDnsCustomData} subdomainList={subdomainList} thisScanner="shufflednsCustom"/>
                }
            </div>
        </div>
    )
}

export default ShuffleDnsCustom;