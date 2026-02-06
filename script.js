const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

const dataStore = {
    sessao: [],
    grau: [],
    nome: [],
    obreiro: [],
    potencia: []
};

const apiConfig = {
    emailjs: {
        serviceId: 'service_e8kbkm9',
        templateId: 'template_6phdpk7',
        publicKey: 'Xvjenc_N-c2vDt412'
    },
    twilio: {
        accountSid: '',
        authToken: '',
        whatsappNumber: ''
    }
};

let currentSendType = null;

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
    loadApiConfig();
}

function saveData() {
    localStorage.setItem('certificateData', JSON.stringify(dataStore));
}

function loadApiConfig() {
    const stored = localStorage.getItem('apiConfig');
    if (stored) {
        Object.assign(apiConfig, JSON.parse(stored));
        document.getElementById('emailjsServiceId').value = apiConfig.emailjs.serviceId;
        document.getElementById('emailjsTemplateId').value = apiConfig.emailjs.templateId;
        document.getElementById('emailjsPublicKey').value = apiConfig.emailjs.publicKey;
        document.getElementById('twilioAccountSid').value = apiConfig.twilio.accountSid;
        document.getElementById('twilioAuthToken').value = apiConfig.twilio.authToken;
        document.getElementById('twilioWhatsappNumber').value = apiConfig.twilio.whatsappNumber;
    }
}

function saveApiConfig() {
    apiConfig.emailjs.serviceId = document.getElementById('emailjsServiceId').value;
    apiConfig.emailjs.templateId = document.getElementById('emailjsTemplateId').value;
    apiConfig.emailjs.publicKey = document.getElementById('emailjsPublicKey').value;
    apiConfig.twilio.accountSid = document.getElementById('twilioAccountSid').value;
    apiConfig.twilio.authToken = document.getElementById('twilioAuthToken').value;
    apiConfig.twilio.whatsappNumber = document.getElementById('twilioWhatsappNumber').value;
    
    localStorage.setItem('apiConfig', JSON.stringify(apiConfig));
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

function generatePdfBlob() {
    return new Promise((resolve) => {
        const certificate = document.getElementById('certificate');
        
        const opt = {
            margin: [5, 5, 5, 5],
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 1.5,
                useCORS: true,
                letterRendering: true,
                allowTaint: true,
                logging: false
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'landscape',
                compress: true
            },
            pagebreak: { mode: 'avoid-all' }
        };
        
        html2pdf().set(opt).from(certificate).output('blob').then(resolve);
    });
}

document.getElementById('downloadPdfBtn').addEventListener('click', function() {
    const certificate = document.getElementById('certificate');
    const nome = document.getElementById('certNome').textContent.replace(/\s+/g, '_');
    const data = document.getElementById('certData').textContent.replace(/\s+/g, '_');
    
    const opt = {
        margin: [5, 5, 5, 5],
        filename: `Certificado_${nome}_${data}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 1.5,
            useCORS: true,
            letterRendering: true,
            allowTaint: true,
            logging: false
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'landscape',
            compress: true
        },
        pagebreak: { mode: 'avoid-all' }
    };
    
    html2pdf().set(opt).from(certificate).save();
});

document.getElementById('shareWhatsappBtn').addEventListener('click', function() {
    if (!apiConfig.twilio.accountSid || !apiConfig.twilio.authToken) {
        alert('Configure as credenciais do Twilio WhatsApp na aba "Configurações API" primeiro!');
        return;
    }
    
    currentSendType = 'whatsapp';
    document.getElementById('sendModalTitle').textContent = 'Enviar via WhatsApp';
    document.getElementById('sendModalLabel').textContent = 'Número do WhatsApp:';
    document.getElementById('sendRecipient').placeholder = '+5551999999999';
    document.getElementById('sendModalHint').textContent = 'Formato: +55 + DDD + número (ex: +5551999999999)';
    document.getElementById('sendModal').style.display = 'flex';
});

document.getElementById('shareEmailBtn').addEventListener('click', function() {
    if (!apiConfig.emailjs.publicKey || !apiConfig.emailjs.templateId) {
        alert('⚠️ Configuração Incompleta!\n\nVocê precisa configurar:\n1. Template ID\n2. Public Key\n\nAcesse a aba "Configurações API" e preencha estes campos.\n\nSeu Service ID já está configurado: service_e8kbkm9');
        return;
    }
    
    currentSendType = 'email';
    document.getElementById('sendModalTitle').textContent = 'Enviar por E-mail';
    document.getElementById('sendModalLabel').textContent = 'E-mail do destinatário:';
    document.getElementById('sendRecipient').placeholder = 'exemplo@email.com';
    document.getElementById('sendModalHint').textContent = 'Digite o endereço de e-mail completo';
    document.getElementById('sendModal').style.display = 'flex';
});

document.getElementById('closeSendModal').addEventListener('click', function() {
    document.getElementById('sendModal').style.display = 'none';
    document.getElementById('sendForm').reset();
    document.getElementById('sendStatus').className = 'send-status';
    document.getElementById('sendStatus').textContent = '';
});

document.getElementById('cancelSendBtn').addEventListener('click', function() {
    document.getElementById('sendModal').style.display = 'none';
    document.getElementById('sendForm').reset();
    document.getElementById('sendStatus').className = 'send-status';
    document.getElementById('sendStatus').textContent = '';
});

document.getElementById('sendForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const recipient = document.getElementById('sendRecipient').value;
    const statusDiv = document.getElementById('sendStatus');
    const sendBtn = document.getElementById('confirmSendBtn');
    
    sendBtn.disabled = true;
    sendBtn.textContent = 'Enviando...';
    statusDiv.className = 'send-status info';
    statusDiv.textContent = 'Gerando certificado...';
    
    try {
        const pdfBlob = await generatePdfBlob();
        
        if (currentSendType === 'whatsapp') {
            await sendViaWhatsApp(recipient, pdfBlob);
        } else if (currentSendType === 'email') {
            await sendViaEmail(recipient, pdfBlob);
        }
        
        statusDiv.className = 'send-status success';
        statusDiv.textContent = 'Certificado enviado com sucesso!';
        
        setTimeout(() => {
            document.getElementById('sendModal').style.display = 'none';
            document.getElementById('sendForm').reset();
            statusDiv.className = 'send-status';
            statusDiv.textContent = '';
        }, 3000);
        
    } catch (error) {
        statusDiv.className = 'send-status error';
        statusDiv.textContent = 'Erro ao enviar: ' + error.message;
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Enviar';
    }
});

async function sendViaWhatsApp(phoneNumber, pdfBlob) {
    const nome = document.getElementById('certNome').textContent;
    const sessao = document.getElementById('certSessao').textContent;
    const grau = document.getElementById('certGrau').textContent;
    const data = document.getElementById('certData').textContent;
    
    const mensagem = `🏛️ *Certificado de Presença*\n\n` +
                     `📜 Loja Simbólica Monte Sinai\n\n` +
                     `Certifico que o Irmão *${nome}* abrilhantou a sessão ${sessao} de grau ${grau} na data ${data}.\n\n` +
                     `_Grande Oriente do Rio Grande do Sul - GORGS_`;
    
    const formData = new FormData();
    formData.append('To', `whatsapp:${phoneNumber}`);
    formData.append('From', `whatsapp:${apiConfig.twilio.whatsappNumber}`);
    formData.append('Body', mensagem);
    formData.append('MediaUrl', await blobToBase64(pdfBlob));
    
    const auth = btoa(`${apiConfig.twilio.accountSid}:${apiConfig.twilio.authToken}`);
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${apiConfig.twilio.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`
        },
        body: formData
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao enviar WhatsApp');
    }
    
    return response.json();
}

async function sendViaEmail(email, pdfBlob) {
    const nome = document.getElementById('certNome').textContent;
    const sessao = document.getElementById('certSessao').textContent;
    const grau = document.getElementById('certGrau').textContent;
    const data = document.getElementById('certData').textContent;
    
    if (!apiConfig.emailjs.publicKey) {
        throw new Error('Configure a Public Key do EmailJS nas Configurações API');
    }
    
    if (!apiConfig.emailjs.templateId) {
        throw new Error('Configure o Template ID do EmailJS nas Configurações API');
    }
    
    emailjs.init(apiConfig.emailjs.publicKey);
    
    const pdfBase64 = await blobToBase64(pdfBlob);
    
    const templateParams = {
        to_email: email,
        nome_irmao: nome,
        tipo_sessao: sessao,
        grau: grau,
        data: data,
        pdf_content: pdfBase64.split(',')[1],
        reply_to: email
    };
    
    const response = await emailjs.send(
        apiConfig.emailjs.serviceId,
        apiConfig.emailjs.templateId,
        templateParams
    );
    
    if (response.status !== 200) {
        throw new Error('Erro ao enviar e-mail. Verifique as configurações.');
    }
    
    return response;
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

document.getElementById('saveConfigBtn').addEventListener('click', function() {
    saveApiConfig();
    const statusDiv = document.getElementById('configStatus');
    statusDiv.className = 'config-status success';
    statusDiv.textContent = 'Configurações salvas com sucesso!';
    setTimeout(() => {
        statusDiv.className = 'config-status';
        statusDiv.textContent = '';
    }, 3000);
});

document.getElementById('testConfigBtn').addEventListener('click', async function() {
    const statusDiv = document.getElementById('configStatus');
    statusDiv.className = 'config-status info';
    statusDiv.textContent = 'Testando conexões...';
    
    let errors = [];
    
    if (apiConfig.emailjs.publicKey) {
        try {
            emailjs.init(apiConfig.emailjs.publicKey);
            statusDiv.textContent += '\n✅ EmailJS: Configurado';
        } catch (e) {
            errors.push('EmailJS: ' + e.message);
        }
    } else {
        errors.push('EmailJS não configurado');
    }
    
    if (apiConfig.twilio.accountSid && apiConfig.twilio.authToken) {
        statusDiv.textContent += '\n✅ Twilio: Credenciais salvas (teste real requer envio)';
    } else {
        errors.push('Twilio não configurado');
    }
    
    if (errors.length === 0) {
        statusDiv.className = 'config-status success';
        statusDiv.textContent = '✅ Todas as configurações estão OK!';
    } else {
        statusDiv.className = 'config-status error';
        statusDiv.textContent = '❌ Erros encontrados:\n' + errors.join('\n');
    }
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
