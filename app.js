document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const generatorForm = document.getElementById('generator-form');
    const generateBtn = document.getElementById('generate-btn');
    const spinner = generateBtn.querySelector('.spinner-border');
    const outputDiv = document.getElementById('about-us-content');
    
    // Action button elements
    const actionButtonsDiv = document.getElementById('action-buttons');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Handle the main form submission
    generatorForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        generateBtn.disabled = true;
        spinner.classList.remove('d-none');
        actionButtonsDiv.classList.add('d-none'); // Hide buttons during generation
        outputDiv.innerHTML = "Generating, please wait...";

        const websiteName = document.getElementById('websiteName').value;
        const websiteNiche = document.getElementById('websiteNiche').value;
        const contactEmail = document.getElementById('contactEmail').value;

        try {
            const response = await fetch('generate-about.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: websiteName,
                    niche: websiteNiche,
                    email: contactEmail
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                outputDiv.innerText = result.text;
                // SUCCESS: Show the action buttons
                actionButtonsDiv.classList.remove('d-none'); 
            } else {
                outputDiv.innerText = `Error: ${result.message}`;
            }

        } catch (error) {
            console.error("Error:", error);
            outputDiv.innerText = "An error occurred while communicating with the server.";
        } finally {
            generateBtn.disabled = false;
            spinner.classList.add('d-none');
        }
    });

    // --- NEW FUNCTIONALITY ---

    // 1. Copy Button Logic
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputDiv.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Provide user feedback
            copyBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy Text';
            }, 2000); // Reset button text after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please try again.');
        });
    });

    // 2. Download Button Logic
    downloadBtn.addEventListener('click', () => {
        const textToDownload = outputDiv.innerText;
        const websiteName = document.getElementById('websiteName').value.replace(/[^a-z0-9]/gi, '_'); // Sanitize filename
        const filename = `about_us_${websiteName}.txt`;

        // Create a 'blob' of our text
        const blob = new Blob([textToDownload], { type: 'text/plain' });

        // Create a temporary link element
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        
        // Programmatically click the link to trigger the download
        document.body.appendChild(a);
        a.click();
        
        // Clean up by removing the link
        document.body.removeChild(a);
    });
});