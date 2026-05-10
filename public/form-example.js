const leadForm = document.getElementById('leadForm');
const formMessage = document.getElementById('formMessage');

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const payload = {
    email: formData.get('email'),
    name: formData.get('name'),
    cta: formData.get('cta'),
    source: 'blog-lgpd',
    origin: window.location.href,
    consent: formData.get('consent') === 'on',
    metadata: {
      capturedAt: new Date().toISOString()
    }
  };

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao enviar lead.');
    }

    formMessage.textContent = 'Lead enviado com sucesso! Obrigado pelo seu interesse.';
    formMessage.style.color = '#0f766e';
    leadForm.reset();
  } catch (error) {
    formMessage.textContent = error.message;
    formMessage.style.color = '#b91c1c';
  }
});
