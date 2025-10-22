import React, {useState} from 'react';

const SubDomainForm = props => {
    const [formData, setformData] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        props.formFunction(formData);
    }
    
    return (
        <div className="row mt-5">
            <div className="col-12">
                <form className="form-floating ml-3" onSubmit={handleSubmit}>
                    <label>Collez ici le contenu de {props.thisScanner}.{props.thisFqdn.fqdn}.txt&nbsp;:</label>
                    <textarea className="form-control" style={{height:"300px", width:"600px"}} placeholder="example.com&#x0a;dev.example.com&#x0a;beta.example.com&#x0a;..." onChange={(e)=>setformData(e.target.value)}></textarea>
                    <button className="btn btn-primary mt-2" type="submit">Ajouter les sous-domaines</button>
                </form>
            </div>
        </div>
    )
}

export default SubDomainForm