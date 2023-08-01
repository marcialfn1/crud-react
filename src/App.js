import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl = "http://localhost/apirest-react/";
  const [data, setData] = useState([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado] = useState({
    id: '',
    nombre: '',
    lanzamiento: '',
    desarollador: ''
  });

  const handleChange = e => {
    const {name, value} = e.target;
    setFrameworkSeleccionado((prevState) => ({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }

  const abrirCerrarModalRegister = () => {
    setModalRegister(!modalRegister);
  }

  const abrirCerrarModalUpdate = () => {
    setModalUpdate(!modalUpdate);
  }
  const abrirCerrarModalDelete = () => {
    setModalDelete(!modalDelete);
  }

  const peticionesGet = async () => {
    await axios.get(baseUrl).then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const peticionesPost = async () => {
    var f = new FormData();
    f.append("nombre", frameworkSeleccionado.nombre);
    f.append("lanzamiento", frameworkSeleccionado.lanzamiento);
    f.append("desarrollador", frameworkSeleccionado.desarrollador);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f).then(response => {
      setData(data.concat(response.data));
      abrirCerrarModalRegister();
    }).catch(error => {
      console.log(error);
    })
  }

  const peticionesPut = async () => {
    var f = new FormData();
    f.append("nombre", frameworkSeleccionado.nombre);
    f.append("lanzamiento", frameworkSeleccionado.lanzamiento);
    f.append("desarrollador", frameworkSeleccionado.desarrollador);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}}).then(response => {
      var dataNueva = data;
      dataNueva.map(framework => {
        if (framework.id === frameworkSeleccionado.id) {
          framework.nombre = frameworkSeleccionado.nombre;
          framework.lanzamiento = frameworkSeleccionado.lanzamiento;
          framework.desarollador = frameworkSeleccionado.desarrollador;
        }
      });
      setData(dataNueva);
      abrirCerrarModalUpdate();
    }).catch(error => {
      console.log(error);
    })
  }

  const peticionesDelete = async () => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}}).then(response => {
      setData(data.filter(framework => framework.id !== frameworkSeleccionado.id));
      abrirCerrarModalDelete();
    }).catch(error => {
      console.log(error);
    })
  }

  const seleccionarFramework = (framework, accion) => {
    setFrameworkSeleccionado(framework);
    (accion === "Editar") ?
    abrirCerrarModalUpdate():
    abrirCerrarModalDelete()
  }

  useEffect(() => {
    peticionesGet();
  }, [])

  return (
    <div style={{textAlign: 'center'}}>
      <br/>
      <button className='btn btn-success' onClick={() => abrirCerrarModalRegister()}>Registrar</button>
      <br/><br/>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>
              ID
            </th>
            <th>
              Nombre
            </th>
            <th>
              Lanzamiento
            </th>
            <th>
              Desarrollador
            </th>
            <th>
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map(framework => (
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.nombre}</td>
              <td>{framework.lanzamiento}</td>
              <td>{framework.desarrollador}</td>
              <td>
                <button className='btn btn-primary' onClick={() => seleccionarFramework(framework, "Editar")}>Editar</button> {" "}
                <button className='btn btn-danger' onClick={() => seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ventana Modal Register*/}
      <Modal isOpen={modalRegister}>
        <ModalHeader>Registrar framework</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre: </label>
            <br/>
            <input type='text' className='form-control' name='nombre' onChange={handleChange}/>
            <br/>
            <label>Lanzamiento: </label>
            <br/>
            <input type='text' className='form-control' name='lanzamiento' onChange={handleChange}/>
            <br/>
            <label>Desarrollador: </label>
            <br/>
            <input type='text' className='form-control' name='desarrollador' onChange={handleChange}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => peticionesPost()}>Registrar</button>
          <button className='btn btn-danger' onClick={() => abrirCerrarModalRegister()}>Cancelar</button>
        </ModalFooter>
      </Modal>

       {/* Ventana Modal Update*/}
       <Modal isOpen={modalUpdate}>
        <ModalHeader>Editar framework</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre: </label>
            <br/>
            <input type='text' className='form-control' name='nombre' onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.nombre}/>
            <br/>
            <label>Lanzamiento: </label>
            <br/>
            <input type='text' className='form-control' name='lanzamiento' onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.lanzamiento}/>
            <br/>
            <label>Desarrollador: </label>
            <br/>
            <input type='text' className='form-control' name='desarrollador' onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.desarrollador}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => peticionesPut()}>Editar</button> {" "}
          <button className='btn btn-danger' onClick={() => abrirCerrarModalUpdate()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Ventana Modal Delete*/}
      <Modal isOpen={modalDelete}>
        <ModalBody>
          ¿Estas seguro de eliminar este registro? {frameworkSeleccionado && frameworkSeleccionado.nombre}
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={() => peticionesDelete()}>Si</button>
          <button className='btn btn-secondary' onClick={() => abrirCerrarModalDelete()}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
