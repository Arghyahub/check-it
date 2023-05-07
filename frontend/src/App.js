import React,{useState} from 'react';
import './App.css';
import Alert from './components/Alert';
import ScannerLogo from './barcode-scanner.png'

function App() {
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [Output, setOutput] = useState(null);
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmitFile = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            setErrMsg('something went wrong!');
        };
    };

    const uploadImage = async (base64EncodedImage) => {
        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: JSON.stringify({ data: base64EncodedImage }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(async res => {
              const fin = await res.json() ;
              setOutput(fin) ;
            })
            .catch(error => {
            console.error(error);
            });
              
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');
        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong!');
        }
    };
    return (
        <div className='main-frame'>
            <h1 className="main-text"> <img src={ScannerLogo} alt=".." /> Cheque Scanner</h1>
            <p className="main-para"> Convert Images of text to JSON format</p>

            <div className="form-area">
            <span> </span>
            <span> </span>
            <span> </span>
            <span> </span>
                <h1 className="title">Upload an Image</h1>
                <Alert msg={errMsg} type="danger" />
                <Alert msg={successMsg} type="success" />
                <form onSubmit={handleSubmitFile} className="form">
                    <input
                        id="fileInput"
                        type="file"
                        name="image"
                        onChange={handleFileInputChange}
                        value={fileInputState}
                        className="form-input"
                    />
                    <button className="btn" type="submit">
                        Submit
                    </button>
                </form>
                {previewSource && (
                    <img
                        src={previewSource}
                        alt="chosen"
                        style={{ height: '300px' }}
                    />
                )}
              </div>
            <div className="data">
                {Output && (
                  <div className="prnt">
                    <div className='box1'>
                      {`Name: ${Output.account_name} , Ac.No: ${Output.account_name}`}
                    </div>
                    <div className='box2'>
                      {`Bank: ${Output.bank_address} , Bank.addrs: ${Output.bank_name} , isfc.code: ${Output.ifsc_code}`}
                    </div>
                  </div>
                )}
            </div>

        </div>
    );
};

export default App;
