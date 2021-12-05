import React, { useState, useEffect } from 'react';
import{ AgGridReact} from'ag-grid-react';
import'ag-grid-community/dist/styles/ag-grid.css';
import'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@material-ui/core/Button';
import AddCar from './AddCar';
import EditCar from './EditCar';

export default function Carlist() {
    const [cars, setCars] = useState([]);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }    

    const DeleteCar = (url) => {
        if (window.confirm('Are you sure?')) {
        console.log("Deleting car", url)
        fetch(url, {method: 'DELETE'})
        .then(res => fetchData())
        .catch(err => console.error(err))
        }
     }

     const saveCar = (car) =>{
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
     }

    const updateCar = (car, link) => {
        fetch(link, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    })
    .then(res => fetchData())
        .catch(err => console.error(err))
    }


    const columns = [
        {headerName: 'Brand', field: 'brand', sortable: true, filter: true},
        {headerName: 'Model', field: 'model', sortable: true, filter: true},
        {headerName: 'Color', field: 'color', sortable: true, filter: true},
        {headerName: 'Fuel', field: 'fuel', sortable: true, filter: true},
        {headerName: 'Year',  field: 'year', sortable: true, filter: true},
        {headerName: 'Price', field: 'price', sortable: true, filter: true},     
        {headerName: 'Edit', field: "_links", sortable: false, filter: false, resizable: true, width:100,
         cellRendererFramework: function(params) {
            return <EditCar updateCar={updateCar} car={params.data} /> }},
            
        {headerName: "Delete", field: "_links", sortable: false, filter: false, resizable: true, width:100,
        cellRendererFramework: params => {
            const url = params.value.self.href;
                return (
                    <Button size="small" color ="secondary" onClick={() => DeleteCar(url)}>Delete</Button>
                );
            }
        },
    ]
   

    return (
        <div>
            <AddCar saveCar={saveCar} />

        <div className="ag-theme-material"
            style={{
            height:'700px',
            width:'100%',
            margin:'auto'}}>

        <AgGridReact 
           
            columnDefs={columns}
            rowData={cars}> 
        </AgGridReact>
        </div>
        </div>
    );
}