document.addEventListener('DOMContentLoaded', async () => {

    const dataBodega = async () => {

        const token = '1JHEXDHBCKD9M';
        const params = {
            'accion': 'UNID_Reportes_Bodegas',
            'params': 'test&'
        };

        const url = "http://apiunidrogas.unidrogas.net:3700/general";

        const headers = {
            'Content-Type': 'application/json',
            'token': `${token}`
        }

        const config = {
            method: 'POST',
            headers: headers,
            params: params,
            referrerPolicy: 'origin-when-cross-origin',
        }

        console.log(config);

        try {
            const responseBod = await fetch(url, config);
            const dataBod = await responseBod.json();
            console.log(dataBod);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    }
 
    dataBodega();
});