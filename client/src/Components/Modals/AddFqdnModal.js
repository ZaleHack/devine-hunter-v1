import axios from 'axios';
import React, { useState } from 'react';

const AddFqdnModal = ({ fqdns, setFqdns, setNoFqdns, onClose }) => {
    const [file, setFile] = useState(null);
    const [scanFile, setScanFile] = useState(null);
    const [manualFqdn, setManualFqdn] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrorMessage("");
    }

    const handleManualChange = (e) => {
        setManualFqdn(e.target.value);
        setErrorMessage("");
    }

    const handleScanFileChange = (e) => {
        setScanFile(e.target.files[0]);
        setErrorMessage("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        console.log("handleSubmitFunctionStart");
        if (file) {
            console.log("Reading file");
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target.result);
                    const inScope = content.target?.scope?.include;
                    if (Array.isArray(inScope)) {
                        let domains = inScope.filter(inclusion => inclusion.enabled)
                                             .map(inclusion => {
                                                 return inclusion.host.replace(/(https?:\/\/)?(www\.)?/g, '')
                                                                      .replace(/[\^$\\]/g, '');
                                             });

                        domains = [...new Set(domains)];
                        Promise.allSettled(domains.map(domain => axios.post('/api/fqdn/new', { fqdn: domain })))
                        .then(results => {
                            const createdFqdns = results
                                .filter(result => result.status === 'fulfilled' && result.value?.data?.fqdn)
                                .map(result => result.value.data);
                            const rejectedCount = results.filter(result => result.status === 'rejected').length;

                            if (createdFqdns.length > 0) {
                                setFqdns(prevFqdns => [...prevFqdns, ...createdFqdns]);
                                setNoFqdns(false);
                                resetForm();
                                if (rejectedCount > 0) {
                                    setErrorMessage("Certains FQDN étaient déjà présents et n'ont pas été réimportés.");
                                } else if (typeof onClose === 'function') {
                                    onClose();
                                }
                            } else if (rejectedCount > 0) {
                                setErrorMessage("Tous les FQDN du fichier sont déjà présents dans la liste.");
                            } else {
                                setErrorMessage("Aucun FQDN valide n'a été trouvé dans le fichier.");
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            setErrorMessage("Une erreur est survenue lors de l'import du fichier.");
                        });
                        }
                } catch (err) {
                    console.error("Error parsing JSON", err);
                    setErrorMessage("Impossible de lire le fichier sélectionné.");
                }
            };
    
            reader.readAsText(file);
        } else if (manualFqdn) {
            console.log("Manually adding...");
            const domain = manualFqdn.replace(/(https?:\/\/)?(www\.)?/g, '');
            axios.post('/api/fqdn/new', { fqdn: domain })
                .then(res => {
                    const newFqdn = res.data;
                    let added = false;
                    setFqdns(prevFqdns => {
                        const alreadyExists = prevFqdns.some(existing => existing.fqdn === newFqdn.fqdn);
                        if (alreadyExists) {
                            setErrorMessage("Ce FQDN est déjà présent dans la liste.");
                            return prevFqdns;
                        }
                        added = true;
                        return [...prevFqdns, newFqdn];
                    });
                    if (added) {
                        setNoFqdns(false);
                        resetForm();
                        if (typeof onClose === 'function') {
                            onClose();
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    setErrorMessage("Impossible d'ajouter le FQDN manuellement.");
                });
        } else if (scanFile) {
            console.log(scanFile);
            console.log("Loading Scan File...")
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    let updatedData = [...fqdns];
                    let hasChanges = false;
                    const syncRequests = [];

                    importedData.forEach((importedFqdn) => {
                        const existingIndex = updatedData.findIndex(
                            (existingFqdn) => existingFqdn.fqdn === importedFqdn.fqdn
                        );
                        if (existingIndex === -1) {
                            updatedData.push(importedFqdn);
                            syncRequests.push(axios.post("/api/fqdn/new", importedFqdn));
                            hasChanges = true;
                        } else {
                            const existingEntry = updatedData[existingIndex];
                            const hasDifferences = JSON.stringify(existingEntry) !== JSON.stringify(importedFqdn);
                            if (hasDifferences) {
                                updatedData[existingIndex] = importedFqdn;
                                hasChanges = true;
                            }
                            syncRequests.push(axios.post("/api/fqdn/update", importedFqdn));
                        }
                    });

                    if (hasChanges) {
                        setFqdns(updatedData);
                        setNoFqdns(false);
                        resetForm();
                    } else {
                        setErrorMessage("Le fichier de scan ne contient aucun changement par rapport aux données existantes.");
                    }

                    if (syncRequests.length > 0) {
                        Promise.allSettled(syncRequests)
                            .then(results => {
                                const rejected = results.filter(result => result.status === 'rejected');
                                if (rejected.length > 0) {
                                    setErrorMessage("Certaines entrées n'ont pas pu être synchronisées avec l'API.");
                                } else if (hasChanges && typeof onClose === 'function') {
                                    onClose();
                                }
                            })
                            .catch(() => {
                                setErrorMessage("Une erreur est survenue lors de la synchronisation avec l'API.");
                            });
                    } else if (hasChanges && typeof onClose === 'function') {
                        onClose();
                    }
                } catch (error) {
                    console.error('Error parsing JSON file:', error);
                    setErrorMessage("Impossible de lire le fichier de scan.");
                }
            };
            reader.readAsText(scanFile);
        } else {
            setErrorMessage("Veuillez sélectionner un fichier ou renseigner un FQDN.");
        }
    }

    const resetForm = () => {
        setFile(null);
        setScanFile(null);
        setManualFqdn("");
        setErrorMessage("");
    }

    return (
        <div className="container-fluid">
            <div className="container mt-5">
                <div className="text-center">
                    <h1 className="display-4">Ajouter un FQDN</h1>
                    <p className="lead">Sélectionnez un fichier de configuration Burp Suite ou saisissez un FQDN manuellement</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="configFile">Fichier de configuration&nbsp;:</label>
                        <input type="file" className="form-control" id="configFile" onChange={handleFileChange} />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="scanFile">Fichier de scan&nbsp;:</label>
                        <input type="file" className="form-control" id="scanFile" onChange={handleScanFileChange} />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="manualFqdn">FQDN manuel&nbsp;:</label>
                        <input type="text" className="form-control" id="manualFqdn" value={manualFqdn} onChange={handleManualChange} />
                    </div>
                    {errorMessage && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary btn-lg btn-block mt-5">Ajouter</button>
                </form>
            </div>
        </div>
    );
}

export default AddFqdnModal;
