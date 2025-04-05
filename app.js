document.getElementById('patientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birthDate').value;
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const cellPhone = document.getElementById('cellPhone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;

    // Crear el objeto Patient en formato FHIR
    const patient = {
        resourceType: "Patient",
        name: [{
            use: "official",
            given: [name],
            family: familyName
        }],
        gender: gender,
        birthDate: birthDate,
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        telecom: [{
            system: "phone",
            value: cellPhone,
            use: "home"
        }, {
            system: "email",
            value: email,
            use: "home"
        }],
        address: [{
            use: "home",
            line: [address],
            city: city,
            postalCode: postalCode,
            country: "Colombia"
        }]
    };

    // URL alternativa por si la base necesita ruta específica
    const baseUrl = 'https://hl7-fhir-ehrjosue.onrender.com';
    const endpoints = [
        '/Patient',
        '/fhir/Patient',
        '/fhir/r4/Patient',
        '/api/Patient'
    ];
    
    // Intentar con diferentes endpoints comunes
    const tryEndpoints = async (index = 0) => {
        if (index >= endpoints.length) {
            throw new Error('No se pudo encontrar el endpoint correcto');
        }
        
        const url = baseUrl + endpoints[index];
        console.log('Intentando con:', url);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/fhir+json', // Content-Type específico para FHIR
                    // 'Authorization': 'Bearer TU_TOKEN_AQUI' // Si requiere autenticación
                },
                body: JSON.stringify(patient)
            });
            
            if (!response.ok) {
                if (response.status === 404 && index < endpoints.length - 1) {
                    return tryEndpoints(index + 1);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Success:', data);
            alert('Paciente creado exitosamente!');
            return data;
        } catch (error) {
            if (index < endpoints.length - 1) {
                return tryEndpoints(index + 1);
            }
            console.error('Error:', error);
            alert(`Hubo un error al crear el paciente: ${error.message}`);
            throw error;
        }
    };
    
    tryEndpoints();
});