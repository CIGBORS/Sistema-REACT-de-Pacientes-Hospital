import React, { useState, useEffect } from "react";
import './Mainpage.css';

function Mainpage() {
    const [patient, setPatient] = useState([]);
    const [search, setSearch] = useState("");
    const [edit, setEdit] = useState(null);
    const [form, setForm] = useState({
        nome: "",
        sexo: "",
        email: "",
        cpf: "",
        celular: "",
        data_nasc: "",
        tipo_sanguineo: "",
        peso: "",
    });

    useEffect(() => {
        fetch("/data.json")
          .then((res) => res.json())
          .then((json) => setPatient(json));
    }, []);

    const filterPatient = patient.filter((p) => 
        p.nome.toLowerCase().includes(search.toLowerCase())
    );

    
    const applyCPFMask = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
        if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    };

    const applyPhoneMask = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const applyDateMask = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
        return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    };


    const removeMask = (value) => {
        return value.replace(/\D/g, '');
    };

    const handleEdit = (patient, index) => {
        setEdit(index);
        setForm({
            ...patient,
            cpf: patient.cpf || "",
            celular: patient.celular || "",
            data_nasc: patient.data_nasc || ""
        });
    };
    
    const handleSave = () => {
        const cpfSemMascara = removeMask(form.cpf);
        if (!form.nome || !/\S+@\S+\.\S+/.test(form.email) || cpfSemMascara.length < 11) {
            alert("PREENCHA CORRETAMENTE");
            return;
        }
        
        const newPatients = [...patient];
        newPatients[edit] = {
            ...form,
            cpf: cpfSemMascara,
            celular: removeMask(form.celular),
            data_nasc: removeMask(form.data_nasc)
        };
        setPatient(newPatients);
        setEdit(null);
    };

    const formatForDisplay = (value, type) => {
        if (!value) return "";
        
        switch(type) {
            case 'cpf':
                return applyCPFMask(value);
            case 'phone':
                return applyPhoneMask(value);
            case 'date':
                return applyDateMask(value);
            default:
                return value;
        }
    };

    return (
        <div className="main-container">
            <header className="header">
                <h1>Pacientes Hospital</h1>
            </header>

            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Pesquisar por nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="patients-container">
                <h2>Lista de Pacientes ({filterPatient.length})</h2>
                <div className="patients-grid">
                    {filterPatient.map((p, i) => (
                        <div key={i} className="patient-card">
                            <div className="patient-header">
                                <h3>{p.nome}</h3>
                                <span className={`gender-badge ${p.sexo.toLowerCase()}`}>
                                    {p.sexo}
                                </span>
                            </div>
                            
                            <div className="patient-info">
                                <div className="info-item">
                                    <span className="label">Email:</span>
                                    <span className="value">{p.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">CPF:</span>
                                    <span className="value">{formatForDisplay(p.cpf, 'cpf')}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Telefone:</span>
                                    <span className="value">{formatForDisplay(p.celular, 'phone')}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Nascimento:</span>
                                    <span className="value">{formatForDisplay(p.data_nasc, 'date')}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Tipo Sanguíneo:</span>
                                    <span className="value blood-type">{p.tipo_sanguineo}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Peso:</span>
                                    <span className="value">{p.peso}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleEdit(p, i)} 
                                className="edit-btn"
                            >
                                Editar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {edit !== null && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <h2>Editar Paciente</h2>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nome:</label>
                                <input
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Sexo:</label>
                                <select
                                    value={form.sexo}
                                    onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>CPF:</label>
                                <input
                                    value={applyCPFMask(form.cpf)}
                                    onChange={(e) => {
                                        const numbers = e.target.value.replace(/\D/g, '');
                                        setForm({ ...form, cpf: numbers.slice(0, 11) });
                                    }}
                                    className="form-input"
                                    placeholder="000.000.000-00"
                                />
                            </div>

                            <div className="form-group">
                                <label>Telefone:</label>
                                <input
                                    value={applyPhoneMask(form.celular)}
                                    onChange={(e) => {
                                        const numbers = e.target.value.replace(/\D/g, '');
                                        setForm({ ...form, celular: numbers.slice(0, 11) });
                                    }}
                                    className="form-input"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div className="form-group">
                                <label>Data de Nascimento:</label>
                                <input
                                    value={applyDateMask(form.data_nasc)}
                                    onChange={(e) => {
                                        const numbers = e.target.value.replace(/\D/g, '');
                                        setForm({ ...form, data_nasc: numbers.slice(0, 8) });
                                    }}
                                    className="form-input"
                                    placeholder="dd/mm/aaaa"
                                />
                            </div>

                            <div className="form-group">
                                <label>Tipo Sanguíneo:</label>
                                <select
                                    value={form.tipo_sanguineo}
                                    onChange={(e) => setForm({ ...form, tipo_sanguineo: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="">Selecione</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Peso (kg):</label>
                                <input
                                    type="text"
                                    value={form.peso}
                                    onChange={(e) => setForm({ ...form, peso: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button onClick={() => setEdit(null)} className="cancel-btn">
                                Cancelar
                            </button>
                            <button onClick={handleSave} className="save-btn">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Mainpage;