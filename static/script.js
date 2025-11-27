document.getElementById('predForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // UI Elements
    const btn = document.getElementById('submitBtn');
    const placeholder = document.getElementById('resultsPlaceholder');
    const content = document.getElementById('resultsContent');
    const cropResult = document.getElementById('cropResult');
    const regGrid = document.getElementById('regGrid');

    // Loading State
    btn.disabled = true;
    btn.innerHTML = 'Processing... <div class="loader"></div>';
    
    // Collect Data
    const formData = {
        N: document.getElementById('N').value,
        P: document.getElementById('P').value,
        K: document.getElementById('K').value,
        OC: document.getElementById('OC').value,
        Zinc: document.getElementById('Zinc').value,
        Sulphur: document.getElementById('Sulphur').value,
        Temp: document.getElementById('Temp').value,
        Humidity: document.getElementById('Humidity').value,
        pH: document.getElementById('pH').value,
        Rainfall: document.getElementById('Rainfall').value
    };

    try {
        // --- UPDATED URL HERE ---
        const response = await fetch('https://tpc08-dasc-ai-backend.hf.space/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Switch from Placeholder to Content
            placeholder.style.display = 'none';
            content.style.display = 'block';
            
            // 1. Classification (Crop)
            cropResult.innerText = result.classification_output;

            // 2. Regression (Grid)
            regGrid.innerHTML = '';
            
            // Define names
            const names = ["Urea Requirement", "DAP Dosage", "MOP Dosage", "SSP Dosage", "Zinc Sulphate"];
            
            result.regression_output.forEach((val, index) => {
                const name = names[index] || `Nutrient ${index + 1}`;
                const card = `
                    <div class="stat-box">
                        <span class="stat-label">${name}</span>
                        <div class="stat-value">${val.toFixed(2)} <span style="font-size:0.8rem; opacity:0.7">kg/ha</span></div>
                    </div>
                `;
                regGrid.innerHTML += card;
            });

        } else {
            alert('Error: ' + result.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server. Please try again in a moment.');
    } finally {
        // Reset Button
        btn.disabled = false;
        btn.innerHTML = 'Run Analysis';
    }
});