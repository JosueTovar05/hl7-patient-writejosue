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

    // Enviar los datos usando Fetch API
        try {
            const response = await fetch('https://cors-anywhere.herokuapp.com/hhttps://hl7-fhir-ehrjosue.onrender.com/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(patient)
            });
    
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(Error en la API: ${response.status} - ${errorData});
            }
    
            const data = await response.json();
            console.log('Success:', data);
            alert(Paciente creado exitosamente! ID: ${data.id || data._id});
            document.getElementById('patientForm').reset();
        } catch (error) {
            console.error('Error:', error);
            alert(Hubo un error al crear el paciente: ${error.message});
        }
    });