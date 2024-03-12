document.addEventListener('DOMContentLoaded', () => {

    const formularioReporte = document.querySelector('#formularioReporte');

    const dataBodega = async () => {
        let template = '';
        const responseDataBodega = await fetch('https://spradadev.me:5000/reportesBodega');
        const bodegasUni = document.querySelector('#bodegasUni');
        if (responseDataBodega.ok) {
            const dataBodega = await responseDataBodega.json();
            dataBodega.UNID_Reportes_Bodegas.forEach(dataCont => {
                template += `
               <option value="${dataCont.dk}">${dataCont.nombre}</option>
               `;
            });
            bodegasUni.insertAdjacentHTML('beforeend', template);
        }
    }
    dataBodega();

    const dataLabs = async () => {
        let templateLabs = '';
        const responseDataLabs = await fetch('https://spradadev.me:5000/reportesLaboratorios');
        const labsUnid = document.querySelector('#labsUnid');
        if (responseDataLabs.ok) {
            const dataLabs = await responseDataLabs.json();
            dataLabs.UNID_Reportes_Laboratorio.forEach(dataContLabs => {
                templateLabs += `
               <option value="${dataContLabs.dk}">${dataContLabs.nombre}</option>
               `;
            });
            labsUnid.insertAdjacentHTML('beforeend', templateLabs);
        }
    }
    dataLabs();

    const enviarForm = async e => {
        e.preventDefault();
        const bodegasUni = document.querySelector('#bodegasUni').value;
        const labsUnid = document.querySelector("#labsUnid").value;
        const dataIni = document.querySelector("#dataIni").value;
        const dataFin = document.querySelector("#dataFin").value;
        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const fechaFormateada = `${año}-${mes}-${dia}`;
        if (bodegasUni === 'bodega' || labsUnid === 'labs' || dataIni === '' || dataFin === '') {
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: `Revisa que todos los campos estén llenos`,
                footer: '<a href="https://soporte.unidrogas.co/zoho/" target="_blank">¿Tienes un problema?</a>'
            });
            return;
        } else if (dataIni > fechaFormateada || dataFin > fechaFormateada) {
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: `La fecha no puede ser mayor a la fecha actual`,
                footer: '<a href="https://soporte.unidrogas.co/zoho/" target="_blank">¿Tienes un problema?</a>'
            });
            return;
        }
        const dataOc = {
            bodegasUni,
            labsUnid,
            dataIni,
            dataFin
        };

        let formData = new FormData();
        formData.append('bodegas', dataOc.bodegasUni);
        formData.append('labs', dataOc.labsUnid);
        formData.append('fechaIni', dataOc.dataIni);
        formData.append('fechaFin', dataOc.dataFin);

        fetch('https://localhost:7253/dataRecibida', {
            method: 'POST',
            body: formData
        })
            .then(responseOrdenCompra => {
                console.log(responseOrdenCompra);
                if (!responseOrdenCompra.ok) {
                    Swal.fire({
                        icon: "error",
                        title: "Error interno",
                        text: "¡Los filtros no se pudieron aplicar!",
                        footer: '<a href="https://soporte.unidrogas.co/zoho/" target="_blank">¿Tienes un problema?</a>'
                    });
                    throw new Error('No responde el backend llamen al senior');
                }
            })
            .then(data => {
                if (data.succes) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Filtros aplicados!",
                        text: "¡Los filtros se aplicaron correctamente!",
                        footer: '<a href="https://soporte.unidrogas.co/zoho/" target="_blank">¿Tienes un problema?</a>'
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.message,
                        footer: '<a href="https://soporte.unidrogas.co/zoho/" target="_blank">¿Tienes un problema?</a>'
                    });
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setTimeout(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Error interno",
                        text: "¡Los filtros no se pudieron aplicar!",
                        footer: '<a href="https://soporte.unidrogas.co/zoho/" target="_blank">¿Tienes un problema?</a>'
                    });
                }, 2000);
            });
        let templateTable = '';
        const responseTable = await fetch('https://localhost:7253/reportesRecepcionOrdenCompra');
        const contentTable = await responseTable.json();
        const tableOc = document.querySelector('#tableOc');
        const contTable = document.querySelector('#cont-table');
        contentTable.UNID_Reportes_RecepcionOrdenDeCompra.forEach(dataTable => {
            templateTable += `
            <tbody>

            <tr>
            <td>${dataTable.codigo}</td>
            <td>${dataTable.nombrecomercial}</td>
            <td>${dataTable.nombrebodega}</td>
            <td>${dataTable.numerooc}</td>
            </tr>
            </tbody>

                `;

            tableOc.insertAdjacentHTML('beforeend', templateTable);
        });

        contTable.addEventListener('scroll', () => {
            const find = document.querySelector('#find');
            const headerTable = document.querySelector('.head');
            find.classList.toggle('sticky', contTable.scrollTop > 0);
        });
    }

    formularioReporte.addEventListener('submit', enviarForm);

});