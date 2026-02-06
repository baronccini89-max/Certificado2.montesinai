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

async function certificateToImage() {
    const certificate = document.getElementById('certificate');
    const canvas = await html2canvas(certificate, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
    });
    return canvas.toDataURL('image/jpeg', 0.95);
}

async function sendViaEmailWithImage(email) {
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
    
    try {
        emailjs.init(apiConfig.emailjs.publicKey);
        
        const certificateImage = await certificateToImage();
        
        const templateParams = {
            to_email: email,
            to_name: nome,
            nome_irmao: nome,
            tipo_sessao: sessao,
            grau: grau,
            data: data,
            reply_to: 'secretaria.lojamontesinai@outlook.com',
            from_name: 'Loja Monte Sinai',
            message: `
Prezado(a) Ir∴ ${nome},

Segue certificado de presença referente à:

• Sessão: ${sessao}
• Grau: ${grau}
• Data: ${data}

Loja Simbólica Monte Sinai
Rito Adonhiramita – Centro Templário – Or∴ de Porto Alegre, RS

Grande Oriente do Rio Grande do Sul – GORGS
Fundada em 24 de junho de 1977

---
Este é um e-mail automático gerado pelo Sistema de Certificados.
Para baixar o certificado em PDF, acesse o sistema.
            `,
            certificate_image: certificateImage
        };
        
        console.log('Enviando e-mail com EmailJS...');
        console.log('Destinatário:', email);
        
        const response = await emailjs.send(
            apiConfig.emailjs.serviceId,
            apiConfig.emailjs.templateId,
            templateParams
        );
        
        console.log('E-mail enviado com sucesso!', response);
        
        if (response.status !== 200) {
            throw new Error(`Erro ao enviar e-mail. Status: ${response.status}`);
        }
        
        return response;
        
    } catch (error) {
        console.error('Erro detalhado:', error);
        throw new Error(error.message || 'Erro ao enviar e-mail. Verifique as configurações.');
    }
}
