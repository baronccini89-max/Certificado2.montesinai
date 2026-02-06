const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

const dataStore = {
    sessao: [],
    grau: [],
    nome: [],
    obreiro: [],
    potencia: []
};

function initializeData() {
    const stored = localStorage.getItem('certificateData');
    if (stored) {
        const parsed = JSON.parse(stored);
        Object.assign(dataStore, parsed);
    } else {
        dataStore.sessao = ['Magna de Iniciação', 'Magna de Elevação', 'Magna de Exaltação', 'Sessão Ordinária'];
        dataStore.grau = ['1º', '2º', '3º'];
        dataStore.nome = ['JOSÉ XAMUSET DUARTE NUNES'];
        dataStore.obreiro = ['A∴R∴L∴'];
        dataStore.potencia = ['S∴ SANTO GRAAL nº 4690 do GOB-RS'];
        saveData();
    }
    updateAllLists();
}

function saveData() {
    localStorage.setItem('certificateData', JSON.stringify(dataStore));
}

function updateAllLists() {
    updateDatalist('sessao');
    updateDatalist('grau');
    updateDatalist('nome');
    updateDatalist('obreiro');
    updateDatalist('potencia');
    
    updateListView('sessao');
    updateListView('grau');
    updateListView('nome');
    updateListView('obreiro');
    updateListView('potencia');
}

function updateDatalist(type) {
    const datalist = document.getElementById(`${type}List`);
    if (!datalist) return;
    
    datalist.innerHTML = '';
    const sortedData = [...dataStore[type]].sort();
    sortedData.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        datalist.appendChild(option);
    });
}

function updateListView(type) {
    const listView = document.getElementById(`${type}ListView`);
    if (!listView) return;
    
    listView.innerHTML = '';
    const sortedData = [...dataStore[type]].sort();
    sortedData.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item}</span>
            <button onclick="removeItem('${type}', ${dataStore[type].indexOf(item)})" class="remove-btn">Remover</button>
        `;
        listView.appendChild(li);
    });
}

function addItem(type) {
    const input = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const value = input.value.trim();
    
    if (value && !dataStore[type].includes(value)) {
        dataStore[type].push(value);
        saveData();
        updateDatalist(type);
        updateListView(type);
        input.value = '';
    }
}

function removeItem(type, index) {
    dataStore[type].splice(index, 1);
    saveData();
    updateDatalist(type);
    updateListView(type);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        sessionStorage.setItem('loggedIn', 'true');
    } else {
        errorDiv.textContent = 'Usuário ou senha incorretos';
        errorDiv.style.display = 'block';
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.removeItem('loggedIn');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetTab = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(`${targetTab}Tab`).classList.add('active');
    });
});

document.getElementById('certificateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const sessao = document.getElementById('sessaoInput').value;
    const grau = document.getElementById('grauInput').value;
    const nome = document.getElementById('nomeInput').value;
    const obreiro = document.getElementById('obreiroInput').value;
    const potencia = document.getElementById('potenciaInput').value;
    const data = document.getElementById('dataInput').value;
    
    const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    document.getElementById('certSessao').textContent = sessao;
    document.getElementById('certGrau').textContent = grau;
    document.getElementById('certNome').textContent = nome;
    document.getElementById('certObreiro').textContent = obreiro;
    document.getElementById('certPotencia').textContent = potencia;
    document.getElementById('certData').textContent = dataFormatada;
    
    document.getElementById('certificatePreview').style.display = 'flex';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('certificatePreview').style.display = 'none';
});

window.addEventListener('click', function(e) {
    const modal = document.getElementById('certificatePreview');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

document.getElementById('downloadPdfBtn').addEventListener('click', function() {
    const certificate = document.getElementById('certificate');
    const nome = document.getElementById('certNome').textContent.replace(/\s+/g, '_');
    const data = document.getElementById('certData').textContent.replace(/\s+/g, '_');
    
    const opt = {
        margin: 10,
        filename: `Certificado_${nome}_${data}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(certificate).save();
});

window.addEventListener('load', function() {
    initializeData();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataInput').value = today;
    
    if (sessionStorage.getItem('loggedIn') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
    }
});
