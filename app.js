document.getElementById('patientForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const familyName = document.getElementById('familyName').value.trim();
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birthDate').value;
    const identifierSystem = document.getElementById('identifierSystem').value.trim();
    const identifierValue = document.getElementById('identifierValue').value.trim();
    const cellPhone = document.getElementById('cellPhone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();

    if (!name || !familyName || !gender || !birthDate || !identifierSystem || !identifierValue) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }

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
        telecom: [
            cellPhone ? { system: "phone", value: cellPhone, use: "home" } : null,
            email ? { system: "email", value: email, use: "home" } : null
        ].filter(Boolean),
        address: [{
            use: "home",
            line: address ? [address] : [],
            city: city,
            postalCode: postalCode,
            country: "Colombia"
        }]
    };

    try {
        const response = await fetch('https://hl7-fhir-ehrjosue.onrender.com/Patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(patient)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error en la API: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        alert(`Paciente creado exitosamente! ID: ${data.id || data._id}`);
        document.getElementById('patientForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error al crear paciente: ${error.message}`);
    }
});