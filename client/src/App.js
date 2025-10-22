import React, {useState, useEffect} from 'react';
import axios from 'axios';import Modal from 'react-modal';
import AddFqdnModal from './Components/Modals/AddFqdnModal';
import Fqdn from './Views/Fqdn';
import './App.css'

function App() {
  useEffect(()=>setActiveTab(0), [App.index]);
  const [fqdns, setFqdns] = useState([]);
  const [noFqdns, setNoFqdns] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [fireStarter, setFireStarter] = useState(true);
  const [fireCloud, setFireCloud] = useState(false);
  const [fireScanner, setFireScanner] = useState(false);
  const [fireSpreadder, setFireSpreadder] = useState(false);
  const [fireEnumeration, setFireEnumeration] = useState(false);
  const [scanRunning, setScanRunning] = useState(false)
  const [scanStep, setScanStep] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanStepName, setScanStepName] = useState(false)
  const [scanSingleDomain, setScanSingleDomain] = useState(true);
  const [selectedFqdns, setSelectedFqdns] = useState([]);
  const [coreModule, setCoreModule] = useState("N/a")
  const [scanDomain, setScanDomain] = useState("N/a")
  
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}_${month}_${day}_${hours}-${minutes}-${seconds}`;
  };

  const [fileName, setFileName] = useState(getCurrentDateTime());
  
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/status');
        const result = await response.json();
        setScanRunning(result['scan_running']);
        setScanStep(result['scan_step']);
        setScanStepName(result['scan_step_name']);
        setScanComplete(result['scan_complete']);
        setCoreModule(result['core_module']);
        setScanDomain(result['scan_target']);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData()

    axios.post('http://localhost:8000/api/fqdn/all', {})
      .then(res=>{
        console.log(res.data);
        setFqdns(res.data);
        if (res.data.length > 0) {
          setNoFqdns(false);
        }
        setLoaded(true);
      })
      .catch(err=>console.log(err))
    
    const interval = setInterval(() => {
          fetchData();
        }, 500);
      
    return () => clearInterval(interval);
  }, [refreshCounter]);

  // Debugging: Log the selected FQDN whenever the activeTab changes
  useEffect(() => {
    if (fqdns.length > 0 && activeTab < fqdns.length) {
      console.log("Selected FQDN in App.js:", fqdns[activeTab]);
    }
  }, [activeTab, fqdns]);

  const addNewFqdn = () => {
    setNoFqdns(true);
  }

  const exportData = () => {
    const jsonData = JSON.stringify(fqdns, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const a = document.createElement('a');
    a.download = `${fileName}.json`;
    a.href = window.URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          importedData.forEach((importedFqdn) => {
            const existingIndex = fqdns.findIndex(
              (existingFqdn) => existingFqdn.fqdn === importedFqdn.fqdn
            );
            if (existingIndex === -1) {
              setFqdns((prevData) => [...prevData, importedFqdn]);
              axios.post("http://localhost:8000/api/fqdn/new",importedFqdn)
            } else {
              setFqdns((prevData) => {
                const newData = [...prevData];
                newData[existingIndex] = importedFqdn;
                return newData;
              });
              axios.post("http://localhost:8000/api/fqdn/update",importedFqdn)
            }
          });
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const deleteFqdn = () => {
    const fqdnToDelete = fqdns[activeTab];
  
    axios.post('http://localhost:8000/api/fqdn/delete', fqdnToDelete)
      .then(res => {
        // Remove the deleted FQDN from the state
        const updatedFqdns = fqdns.filter((_, index) => index !== activeTab);
        setFqdns(updatedFqdns);
        if (updatedFqdns.length === 0) {
          setNoFqdns(true);
        } else {
          // Set the active tab to the first FQDN if available
          setActiveTab(0);
        }
      })
      .catch(err => console.log(err));
  }
  
  const handleUnloadButtonClick = () => {
    document.getElementById('fileInput').value = '';
  };

  const runWildfire = () => {
    const selectedFqdn = fqdns[activeTab].fqdn;
    console.log("runWildfire: " + selectedFqdn)

    if (!scanSingleDomain){
      const payload = {
        fireStarter: fireStarter,
        fireCloud: fireCloud,
        fireScanner: fireScanner,
        fqdn: selectedFqdn,
        scanSingleDomain: scanSingleDomain,
        domainCount: fqdns.length
      };
      axios.post('http://localhost:5000/wildfire', payload)
      .then(res => {
        setScanRunning(true);
        console.log("Wildfire Running Against All Domains...");
      })
      .catch(err => console.log(err));
    } else {
      const payload = {
        fireStarter: fireStarter,
        fireCloud: fireCloud,
        fireScanner: fireScanner,
        fqdn: selectedFqdn,
        scanSingleDomain: scanSingleDomain,
        domainCount: 1
      };
      axios.post('http://localhost:5000/wildfire', payload)
      .then(res => {
        setScanRunning(true);
        console.log("Wildfire Running Against Single Domain...");
      })
      .catch(err => console.log(err));
    }
  }  

  // Dropdown change handler
  const handleDropdownChange = (e) => {
    setActiveTab(parseInt(e.target.value));
  }

  const handleScanSingleDomainChange = (e) => {
    setScanSingleDomain(e.target.checked);
  }

  const handleStartToggle = () => {
    if (fireStarter) {
      setFireStarter(false);
    } else {
      setFireStarter(true)
    }
  }

  const handleCloudToggle = () => {
    if (fireCloud) {
      setFireCloud(false);
    } else {
      setFireCloud(true)
    }
  }

  const handleScannerToggle = () => {
    if (fireScanner) {
      setFireScanner(false);
    } else {
      setFireScanner(true)
    }
  }

  const handleSpreadToggle = () => {
    if (fireScanner) {
      setFireSpreadder(false);
    } else {
      setFireSpreadder(true)
    }
  }

  const handleEnumToggle = () => {
    if (fireScanner) {
      setFireEnumeration(false);
    } else {
      setFireEnumeration(true)
    }
  }

  Modal.setAppElement('#root');

  const deleteMultipleFqdn = () => {
    // Logic to delete selected FQDNs
    // Example: axios.post('your-api-endpoint', { fqdnsToDelete: selectedFqdns });
    console.log('Deleting FQDNs:', selectedFqdns);
    // After deletion, clear the selected FQDNs
    setSelectedFqdns([]);
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
      handleFileUpload(file);
      document.getElementById('fileInput').value = '';
    }
  };

  const handleCollectScreenshotsButton = () => {
    axios.post('http://localhost:5000/collect_sceenshots',{})
      .then(res => {
        console.log("Collecting Screenshots...");
      })
  }


return (
  <div className="app-shell">
    {loaded && (
      <Modal
        isOpen={noFqdns}
        style={{
          overlay: {
            backgroundColor: 'rgba(31, 31, 31, 0.55)'
          },
          content: {
            height: '700px',
            width: '520px',
            margin: 'auto',
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            border: 'none',
            boxShadow: '0 24px 60px rgba(183, 28, 28, 0.25)'
          }
        }}
      >
        <AddFqdnModal fqdns={fqdns} setFqdns={setFqdns} setNoFqdns={setNoFqdns} />
      </Modal>
    )}

    <header className="app-header">
      <div className="brand">
        <div className="brand-logo">DH</div>
        <div className="brand-text">
          <h1>Divine Hunter</h1>
          <p>Plateforme française de gestion des surfaces d'attaque</p>
        </div>
      </div>
      <span className={`status-pill ${scanRunning ? 'active' : ''}`}>
        {scanRunning ? 'Analyse en cours' : 'En veille'}
      </span>
    </header>

    <section className="control-panel">
      <div className="control-card">
        <h3>Gestion des domaines</h3>
        <div className="control-row">
          <select
            className="form-select dropdown-select"
            value={activeTab}
            onChange={handleDropdownChange}
            aria-label="Sélectionner un FQDN"
          >
            {fqdns.map((fqdn, index) => (
              <option key={index} value={index}>{fqdn.fqdn}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={addNewFqdn}>Ajouter un FQDN</button>
          <button className="btn btn-light text-danger shadow-sm" onClick={deleteFqdn}>Supprimer le FQDN</button>
        </div>
        <div className="toggle">
          <input
            type="checkbox"
            checked={scanSingleDomain}
            onChange={handleScanSingleDomainChange}
            id="single-domain"
          />
          <label htmlFor="single-domain">Analyser uniquement le domaine sélectionné</label>
        </div>
      </div>

      <div className="control-card">
        <h3>Export des données</h3>
        <div className="control-row">
          <label className="mb-0">
            Nom du fichier
            <input
              className="ms-2"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" onClick={exportData}>Exporter</button>
        </div>
      </div>

      <div className="control-card">
        <h3>Import des données</h3>
        <div className="control-row">
          <input className="form-control" type="file" accept=".json" id="fileInput" />
          <div className="secondary-actions">
            <button className="btn btn-primary" onClick={handleButtonClick}>Traiter</button>
            <button className="btn" onClick={handleUnloadButtonClick}>Réinitialiser</button>
          </div>
        </div>
      </div>

      <div className="control-card">
        <h3>Automatisation</h3>
        <div className="control-row">
          <button className="btn btn-light text-danger shadow-sm" onClick={handleCollectScreenshotsButton}>
            Capturer des captures d'écran
          </button>
        </div>
      </div>
    </section>

    <section className="status-panel">
      <span>
        Module principal : {coreModule}<br />
        Domaine cible : {scanDomain}
      </span>
      <span>
        Progression : {scanStep} / {scanComplete}<br />
        Étape en cours : {scanStepName}
      </span>
      <select
        className="form-select dropdown-select"
        value="wildfire"
        onChange={handleDropdownChange}
        aria-label="Sélectionner un scénario d'analyse"
      >
        <option value="wildfire">Wildfire.py</option>
        <option value="slowburn" disabled>Slowburn.py</option>
        <option value="scorched-earth" disabled>ScorchedEarth.py</option>
      </select>
      <div className="toggle-group">
        <div className="toggle">
          <input type="checkbox" id="firestart" name="firestart" onChange={handleStartToggle} checked={fireStarter} />
          <label htmlFor="firestart">Module déclencheur</label>
        </div>
        <div className="toggle">
          <input type="checkbox" id="firecloud" name="firecloud" onChange={handleCloudToggle} checked={fireCloud} />
          <label htmlFor="firecloud">Module cloud</label>
        </div>
        <div className="toggle">
          <input type="checkbox" id="firescan" name="firescan" onChange={handleScannerToggle} checked={fireScanner} />
          <label htmlFor="firescan">Module scanner</label>
        </div>
        <div className="toggle disabled">
          <input type="checkbox" id="fireshare" name="fireshare" onChange={handleSpreadToggle} checked={fireSpreadder} disabled />
          <label htmlFor="fireshare" className="text-muted">Module propagation</label>
        </div>
        <div className="toggle disabled">
          <input type="checkbox" id="fireenum" name="fireenum" onChange={handleEnumToggle} checked={fireEnumeration} disabled />
          <label htmlFor="fireenum" className="text-muted">Module d'énumération</label>
        </div>
      </div>
      <div className="secondary-actions">
        {scanRunning ? (
          <button className="btn btn-light" type="button" disabled>Annuler</button>
        ) : (
          <button className="btn btn-primary" type="button" onClick={runWildfire}>Lancer l'analyse</button>
        )}
        <button className="btn btn-light" type="button" disabled>Pause</button>
      </div>
    </section>

    <div className="content-card">
      {noFqdns === false && fqdns.length > 0 && loaded && (
        <Fqdn index={activeTab} thisFqdn={fqdns[activeTab]} buttonFunction={deleteFqdn} setActiveTab={setActiveTab} />
      )}
    </div>
  </div>
  );
}

export default App;
