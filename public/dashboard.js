const filterForm = document.getElementById('filterForm');
const leadsTable = document.getElementById('leadsTable');
const leadCount = document.getElementById('leadCount');
const resetButton = document.getElementById('resetButton');

async function loadLeads(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/leads?${query}` : '/api/leads';
  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    leadCount.textContent = 'Erro ao carregar leads.';
    return;
  }

  const leads = result.data;
  leadCount.textContent = `${leads.length} lead(s) encontrados`;
  leadsTable.innerHTML = '';

  leads.forEach((lead) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(lead.created_at).toLocaleString()}</td>
      <td>${lead.email}</td>
      <td>${lead.name || '-'}</td>
      <td>${lead.cta}</td>
      <td>${lead.source || '-'}</td>
      <td>${lead.origin || '-'}</td>
    `;
    leadsTable.appendChild(row);
  });
}

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(filterForm);
  const params = {};
  if (formData.get('cta')) params.cta = formData.get('cta');
  if (formData.get('source')) params.source = formData.get('source');
  if (formData.get('startDate')) params.startDate = formData.get('startDate');
  if (formData.get('endDate')) params.endDate = formData.get('endDate');
  loadLeads(params);
});

resetButton.addEventListener('click', () => {
  filterForm.reset();
  loadLeads();
});

loadLeads();
