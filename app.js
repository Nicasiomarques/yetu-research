const STORAGE_KEY = 'yetu_budget_data';
let currentStep = 1;
let totalSteps = 8;
let formData = null;

// Fallback data em caso de falha ao carregar data.json
const FALLBACK_DATA = {"steps":[{"id":1,"title":"Operação e Negócio","shortTitle":"Operação","questions":[{"name":"peak_hours","label":"Quando a plataforma está mais ativa?","description":"Quando é que os seus clientes mais usam a plataforma para fazer transações? (Ex: Troca de moedas, depósitos, levantamentos)","type":"radio","options":[{"value":"morning","label":"Manhã","sublabel":"8h - 12h"},{"value":"afternoon","label":"Tarde","sublabel":"12h - 18h","default":true},{"value":"evening","label":"Noite","sublabel":"18h - 22h"}]},{"name":"critical_time","label":"O que acontece se a plataforma parar?","description":"Se a plataforma ficar fora do ar (não funcionar), quanto tempo consegue esperar até alguém resolver o problema?","type":"radio","options":[{"value":"economy","label":"Posso esperar 2-3 dias","desc":"Não é urgente, prefiro gastar menos"},{"value":"balanced","label":"Preciso de resolução em 24h","desc":"Equilíbrio entre custo e rapidez","default":true},{"value":"premium","label":"Preciso de ajuda imediata","desc":"Meus clientes não podem esperar, mesmo à noite"}]},{"name":"downtime_impact","label":"Qual o impacto se ficar 15 minutos fora do ar?","type":"select","options":[{"value":"low","label":"Pequeno - Apenas inconvenience"},{"value":"medium","label":"Médio - Afeta a reputação","default":true},{"value":"high","label":"Alto - Prejuízo financeiro significativo"},{"value":"critical","label":"Crítico - Perco clientes"}]}]},{"id":2,"title":"Garantia de Serviço","shortTitle":"SLA","questions":[{"name":"uptime","label":"Com que frequência a plataforma precisa estar disponível?","description":"Quanto tempo por mês a plataforma pode estar offline? Pense em quantos clientes perde se o site ficar fora do ar.","type":"radio","options":[{"value":"99","label":"Funciona na maioria do tempo","desc":"Pode ficar offline até 7h por mês"},{"value":"99.5","label":"Quase sempre disponível","desc":"Pode ficar offline até 3h por mês","default":true},{"value":"99.9","label":"Sempre disponível","desc":"Só pode ficar offline 22 minutos por mês"}]},{"name":"response_time","label":"Tempo de resposta quando há problema","description":"Quando reportares um problema, quanto tempo quer esperar até alguém da nossa equipa responder?","type":"radio","options":[{"value":"24h","label":"24 horas (dia útil)","desc":"Resposta no próximo dia útil"},{"value":"4h","label":"4 horas","desc":"Resposta rápida durante o dia","default":true},{"value":"1h","label":"1 hora - 24/7","desc":"Resposta a qualquer hora, mesmo à noite"}]},{"name":"emergency_name","label":"Quem contactamos em emergências?","description":"Se houver um problema grave fora do horário comercial, quem deve ser contactado?","type":"fields","fields":[{"name":"emergency_name","type":"text","placeholder":"Nome completo"},{"name":"emergency_phone","type":"tel","placeholder":"Telefone / WhatsApp"}]}]},{"id":3,"title":"Como Prefere Trabalhar","shortTitle":"Autonomia","questions":[{"name":"autonomy","label":"Quem toma as decisões técnicas?","description":"Quando houver necessidade de fazer alterações técnicas (atualizações, segurança, mudanças no sistema), quem decide?","type":"radio","options":[{"value":"full","label":"Deixo a Yetu Tech decidir","desc":"Confio na equipa, só quero receber relatórios mensais","default":true},{"value":"consult","label":"Quero ser consultado","desc":"Perguntem-me antes de fazer qualquer mudança"},{"value":"total","label":"Eu é que mando","desc":"Todas as decisões passam por mim primeiro"}]},{"name":"crisis_management","label":"E se houver problema grave de madrugada?","description":"Se houver um problema grave às 3 da manhã, o que prefere que façamos?","type":"radio","options":[{"value":"auto","label":"Resolvam e depois expliquem","desc":"Não me acordem, corrijam o problema e depois informem","default":true},{"value":"wake","label":"Acordem-me","desc":"Quero ser contactado para autorizar qualquer intervenção"}]},{"name":"meeting_frequency","label":"Com que frequência quer conversar connosco?","type":"select","options":[{"value":"daily","label":"📅 Diariamente - Para acompanhamento intenso"},{"value":"3days","label":"📅 De 3 em 3 dias - Equilíbrio frequente"},{"value":"weekly","label":"📅 Semanal - Check-in padrão","default":true},{"value":"biweekly","label":"📅 Quinzenal - Bastante autonomia"},{"value":"monthly","label":"📅 Mensal - Apenas relatórios"}]}]},{"id":4,"title":"Segurança e Dados","shortTitle":"Segurança","questions":[{"name":"backup","label":"O que acontece se perdermos os dados?","description":"Se o servidor tiver um problema e perdermos todos os dados, quanto tempo de trabalho perde?","type":"radio","options":[{"value":"weekly","label":"Posso perder até 1 semana","desc":"Fazemos cópia de segurança 1 vez por semana"},{"value":"daily","label":"Posso perder no máximo 1 dia","desc":"Fazemos cópia de segurança todos os dias","default":true},{"value":"realtime","label":"Não posso perder absolutamente nada","desc":"Guardamos tudo em tempo real"}]},{"name":"log_retention","label":"Por quanto tempo guarda o histórico?","description":"Durante quanto tempo precisa guardar os registos de transações e operações?","type":"select","options":[{"value":"3months","label":"3 meses"},{"value":"6months","label":"6 meses","default":true},{"value":"1year","label":"1 ano"},{"value":"2years","label":"2 anos"}]},{"name":"priority","label":"O que é mais importante para si?","type":"radio","options":[{"value":"stability","label":"Que nunca tenha problemas","desc":"Quero que funcione sempre, sem erros","default":true},{"value":"features","label":"Que tenha sempre algo novo","desc":"Quero melhorias e novas funcionalidades"}]},{"name":"compliance","label":"Precisa de certificações específicas?","description":"O seu negócio exige algum tipo de certificação ou compliance?","type":"checkbox","options":[{"value":"lgpd","label":"LGPD / RGPD (Proteção de dados)"},{"value":"pci","label":"PCI-DSS (Pagamentos)"},{"value":"iso","label":"ISO 27001 (Segurança)"}]}]},{"id":5,"title":"Custos e Infraestrutura","shortTitle":"Infra","questions":[{"name":"msg_limit","label":"O que fazer quando acabarem as mensagens?","description":"Se o limite de SMS/E-mail for atingido:","type":"radio","options":[{"value":"stop","label":"Parar de enviar","desc":"Para não gerar custos extras sem minha autorização","default":true},{"value":"auto","label":"Continuar a enviar","desc":"Não quero perder nenhuma mensagem para os clientes"}]},{"name":"traffic_spike","label":"Planeja campanhas de marketing?","description":"Nos próximos meses, vai fazer campanhas que podem atrair muitas pessoas de uma só vez?","type":"radio","options":[{"value":"no","label":"Não","desc":"Tráfego estável, sem surpresas","default":true},{"value":"yes","label":"Sim, talvez","desc":"Campanhas de marketing previstas"},{"value":"massive","label":"Sim, em grande escala","desc":"Eventos/lançamentos com alto impacto"}]},{"name":"domains","label":"Quantos domínios precisa gerir?","type":"select","options":[{"value":"1","label":"1 domínio principal"},{"value":"3","label":"1 domínio + 2 subdomínios","default":true},{"value":"5","label":"até 5 domínios"},{"value":"10","label":"até 10 domínios"},{"value":"10+","label":"mais de 10 domínios"}]}]},{"id":6,"title":"Crescimento e Melhorias","shortTitle":"Evolução","questions":[{"name":"evolution","label":"Como imagina a plataforma no futuro?","description":"O que espera que aconteça com a plataforma nos próximos meses?","type":"radio","options":[{"value":"maintain","label":"Manter como está","desc":"Só quero que continue a funcionar"},{"value":"improve","label":"Melhorar aos poucos","desc":"Quero pequenas melhorias todos os meses","default":true},{"value":"grow","label":"Crescer e evoluir muito","desc":"Quero adicionar novas funcionalidades frequentemente"}]},{"name":"dev_focus","label":"Onde quer investir o tempo de desenvolvimento?","description":"Se a nossa equipa tiver tempo disponível, em que deve trabalhar?","type":"radio","options":[{"value":"invisible","label":"Performance (por baixo)","desc":"Que seja mais rápido e estável"},{"value":"visible","label":"Interface (visível)","desc":"Melhorar botões, cores, textos que o cliente vê","default":true},{"value":"both","label":"Ambos","desc":"Equilíbrio entre os dois"}]},{"name":"new_features","label":"Tem ideias de novas funcionalidades?","type":"textarea","placeholder":"Ex: App mobile, integração com bancos, dashboard de analytics..."}]},{"id":7,"title":"Suporte e Comunicação","shortTitle":"Suporte","questions":[{"name":"communication","label":"Qual a melhor forma de falar connosco?","type":"radio-grid","options":[{"value":"email","label":"E-mail","sublabel":"Documentos/formal"},{"value":"whatsapp","label":"WhatsApp","sublabel":"Mensagens rápidas","default":true},{"value":"call","label":"Telefone","sublabel":"Chamadas diretas"},{"value":"video","label":"Zoom/Teams","sublabel":"Videoconferência"}]},{"name":"user_support","label":"Se um cliente tiver problema técnico?","description":"Se um dos seus clientes tiver dificuldade técnica, quem deve ajudar?","type":"radio","options":[{"value":"direct","label":"Ele contacta-me diretamente","desc":"Sem suporte da Yetu Tech"},{"value":"shared","label":"Yetu Tech ajuda diretamente","desc":"Tenho canal de suporte próprio para clientes","default":true}]},{"name":"contact_hours","label":"Quando prefere ser contactado?","type":"select","options":[{"value":"business","label":"🕘 Horário comercial (9h - 18h) - só dias úteis"},{"value":"extended","label":"🕗 Horário expandido (8h - 20h) - mais flexibilidade","default":true},{"value":"anytime","label":"🕛 A qualquer hora (24/7) - urgência total"}]}]},{"id":8,"title":"Personalize seu Plano","shortTitle":"Extras","questions":[{"name":"extras","label":"Serviços adicionais","description":"Selecione serviços extras que deseja adicionar ao seu plano","type":"checkbox-grid","options":[{"value":"support_247","label":"Suporte 24/7","desc":"Equipe disponível a qualquer hora","price":200},{"value":"backup_realtime","label":"Backup Real-time","desc":"Nunca perde dados","price":100},{"value":"ssl_premium","label":"SSL Premium","desc":"Mais segurança","price":50},{"value":"cdn","label":"CDN Premium","desc":"Site mais rápido","price":60},{"value":"security_audit","label":"Auditoria Segurança","desc":"Verificação trimestral","price":83},{"value":"dedicated_manager","label":"Gerente Dedicado","desc":"Uma pessoa só para si","price":150}]},{"name":"payment_period","label":"Periodicidade de pagamento","type":"radio-grid","options":[{"value":"monthly","label":"Mensal","sublabel":"Sem desconto","default":true},{"value":"quarterly","label":"Trimestral","sublabel":"10% desconto"},{"value":"semiannual","label":"Semestral","sublabel":"15% desconto"}]},{"name":"company_name","label":"Os seus dados","type":"fields","fields":[{"name":"company_name","type":"text","placeholder":"Nome da empresa"},{"name":"company_email","type":"email","placeholder":"E-mail para envio do orçamento"}]}]}],"pricing":{"plans":{"starter":{"hours":4,"price":999},"professional":{"hours":8,"price":1299},"enterprise":{"hours":16,"price":1999}},"extras":{"support_247":200,"backup_realtime":100,"ssl_premium":50,"cdn":60,"security_audit":83,"dedicated_manager":150},"meeting":{"daily":200,"3days":100,"weekly":0,"biweekly":0,"monthly":0},"video_call":30,"setupFee":500},"features":{"starter":["4h desenvolvimento/mês","Backup diário","Monitorização 24/7","Suporte por e-mail","Relatório mensal"],"professional":["8h desenvolvimento/mês","Backup diário","Monitorização 24/7","Suporte WhatsApp","Relatório quinzenal","SSL gratuito"],"enterprise":["16h desenvolvimento/mês","Backup em tempo real","Monitorização 24/7 proativa","Suporte 24/7","CDN Premium","Gerente dedicado"]}};
async function loadFormData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Falha ao carregar data.json');
        return await response.json();
    } catch (error) {
        console.warn('Usando dados fallback:', error);
        return FALLBACK_DATA;
    }
}

const DOMUtils = {
    toggleClass(el, className, force) {
        el?.classList.toggle(className, force);
    },
    updateText(selector, content) {
        const el = document.querySelector(selector);
        if (el) el.textContent = content;
    },
    updateHTML(selector, content) {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = content;
    }
};

const ErrorHandler = {
    handle(error, context, silent = false) {
        console.error(`${context}:`, error);
        if (!silent) this.showError(error, context);
    },
    showError(error, context) {
        let el = document.getElementById('error-notification');
        if (!el) {
            el = document.createElement('div');
            el.id = 'error-notification';
            el.className = 'fixed top-4 right-4 max-w-sm bg-red-50 border-2 border-red-200 rounded-2xl p-4 z-50';
            document.body.appendChild(el);
        }
        el.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-red-500 text-xl">⚠️</span>
                <div>
                    <h4 class="font-bold text-red-900">${context}</h4>
                    <p class="text-sm text-red-700">${error.message || 'Erro inesperado'}</p>
                </div>
                <button onclick="document.getElementById('error-notification').remove()">✕</button>
            </div>`;
        setTimeout(() => el.remove(), 5000);
    }
};

function persistFormData() {
    try {
        const form = document.getElementById('budget-form');
        if (!form) return;
        const fd = new FormData(form);
        const data = {};
        for (const [key, value] of fd.entries()) {
            if (data[key]) {
                data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
            } else {
                data[key] = value;
            }
        }
        data._currentStep = currentStep;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        ErrorHandler.handle(error, 'Salvar dados', true);
    }
}

function loadPersistedData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        ErrorHandler.handle(error, 'Carregar dados salvos', true);
        return null;
    }
}

function restoreFormState() {
    const saved = loadPersistedData();
    if (!saved) return;

    Object.entries(saved).forEach(([key, value]) => {
        if (key.startsWith('_')) return;
        if (Array.isArray(value)) {
            value.forEach(v => {
                const els = document.querySelectorAll(`[name="${key}"][value="${v}"]`);
                els.forEach(el => {
                    if (el.type === 'checkbox') el.checked = true;
                    else if (el.type === 'radio') el.checked = true;
                });
            });
        } else {
            const els = document.querySelectorAll(`[name="${key}"]`);
            els.forEach(el => {
                if (el.type === 'radio' && el.value === value) el.checked = true;
                else if (el.type === 'checkbox') el.checked = true;
                else if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') el.value = value;
            });
        }
    });

    document.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked').forEach(el => {
        if (el.type === 'radio') handleRadioChange({ target: el });
        if (el.type === 'checkbox') handleCheckboxChange({ target: el });
    });

    if (saved._currentStep && saved._currentStep > 1) {
        const target = Math.min(saved._currentStep, totalSteps);
        document.querySelector(`.step[data-step="${currentStep}"]`)?.classList.remove('active');
        currentStep = target;
        document.querySelector(`.step[data-step="${currentStep}"]`)?.classList.add('active');
        updateProgress();
    }
}

async function init() {
    const container = document.getElementById('steps-container');
    try {
        container.innerHTML = '<div class="text-center p-8 text-slate-600">Carregando...</div>';
        formData = await loadFormData();
        totalSteps = formData.steps.length;

        if (!formData?.steps?.length) throw new Error('Dados inválidos');

        renderStepLabels();
        renderSteps();
        updateProgress();
        setupEventListeners();
        restoreFormState();
        
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const value = checkbox.value;
            const conditionalFields = document.querySelectorAll(`.conditional-field[data-show-if="${value}"]`);
            conditionalFields.forEach(field => {
                DOMUtils.toggleClass(field, 'hidden', false);
                const input = field.querySelector('input');
                if (input && !input.value) {
                    input.value = input.getAttribute('min') || 1;
                }
            });
        });
    } catch (error) {
        container.innerHTML = `
            <div class="text-center p-8">
                <p class="text-red-500 mb-4">Erro ao carregar dados.</p>
                <button onclick="location.reload()" class="px-4 py-2 bg-primary-500 text-white rounded-lg">Recarregar</button>
            </div>`;
    }
}

function renderSteps() {
    const container = document.getElementById('steps-container');
    container.innerHTML = formData.steps.map((step, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `
            <div class="step ${isActive}" data-step="${step.id}">
                <div class="glass-effect rounded-3xl shadow-xl shadow-slate-200/50 p-5 md:p-8 step-content">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/25">${step.id}</div>
                        <h2 class="text-lg md:text-xl font-bold text-slate-900">${step.title}</h2>
                    </div>
                    ${step.questions.map(q => renderQuestion(q)).join('')}
                </div>
            </div>
        `;
    }).join('');
}

const GLOSSARY = {
    'SLA': 'SLA (Service Level Agreement) é um contrato que define o nível de serviço que garantimos — por exemplo, quanto tempo demoramos a responder e resolver problemas.',
    'uptime': 'Uptime é o tempo que a sua plataforma fica online e acessível. 99.9% significa que pode ficar parada no máximo 22 minutos por mês.',
    'backup': 'Backup é uma cópia de segurança dos seus dados. Se algo correr mal, podemos restaurar a informação a partir dessa cópia.',
    'CDN': 'CDN (Content Delivery Network) é uma rede de servidores espalhada pelo mundo que faz o seu site carregar mais rápido para os utilizadores, estejam onde estiverem.',
    'SSL': 'SSL é o tecnologia que coloca o cadeado verde no browser e protege os dados dos seus clientes (senhas, pagamentos, etc.).',
    'PCI-DSS': 'PCI-DSS é um padrão de segurança obrigatório para empresas que recebem pagamentos com cartão. Protege os dados dos cartões dos clientes.',
    'LGPD': 'LGPD (Lei Geral de Proteção de Dados) é a lei que obriga a tratar os dados pessoais dos clientes com cuidado — como se guardam, quem pode ver, etc.',
    'ISO 27001': 'ISO 27001 é uma certificação internacional que prova que a sua empresa segue as melhores práticas de segurança da informação.',
    'compliance': 'Compliance significa estar em conformidade com leis e regulamentos do seu setor (ex: proteger dados dos clientes, seguir regras de pagamentos).',
    'domínio': 'Domínio é o endereço do seu site na internet (ex: www.suaempresa.com). Subdomínios são extensões como app.suaempresa.com.',
    'performance': 'Performance é a velocidade e estabilidade do site — quão rápido abre e quão bem funciona mesmo com muitos utilizadores ao mesmo tempo.',
    'monitorização': 'Monitorização é um sistema que vigia a sua plataforma 24h por dia e avisa automaticamente se algo não estiver a funcionar bem.',
    'setup': 'Setup é o valor único pago na instalação e configuração inicial do serviço. Só se paga uma vez.',
    'Relatório Semanal': 'Relatório detalhado de performance enviado todas as semanas com métricas-chave, estatísticas de uso e recomendações de melhorias.',
    'Relatório Personalizado': 'Dashboard customizado com as métricas específicas que você deseja acompanhar, criado sob medida para o seu negócio.',
    'Analytics Avançado': 'Análise profunda do comportamento dos utilizadores: heatmaps, funis de conversão, sessões e padrões de uso.',
    'Treinamento da Equipa': '2 horas mensais de treinamento para sua equipa aprender a usar a plataforma de forma eficiente.',
    'Documentação Técnica': 'Manual completo e atualizado com todas as funcionalidades, tutoriais e guias de uso da plataforma.',
    'Consultoria Estratégica': '1 hora por mês de consultoria para planejamento de growth, melhorias e estratégias de evolução da plataforma.',
    'Auxílio à Migração': 'Apoio técnico completo para migrar dados e funcionalidades de outra plataforma para a Yetu Tech.',
    'Manutenção Preventiva': 'Verificações mensais de saúde do sistema, atualizações de segurança e otimizações proativas.',
};

const LABEL_MAPPINGS = {
	meeting: {
		'daily': 'Reunião diária (daily standup)',
		'3days': 'Reunião de 3 em 3 dias',
		'weekly': 'Semanal',
		'biweekly': 'Quinzenal',
		'monthly': 'Mensal'
	},
	meetingShort: {
		'daily': 'Diária',
		'3days': 'De 3 em 3 dias',
		'weekly': 'Semanal',
		'biweekly': 'Quinzenal',
		'monthly': 'Mensal'
	},
	extras: {
		'support_247': 'Suporte 24/7 Priority',
		'backup_realtime': 'Backup em Tempo Real',
		'ssl_premium': 'SSL Premium + Wildcard',
		'cdn': 'CDN Premium Global',
		'security_audit': 'Auditoria de Segurança Trimestral',
		'dedicated_manager': 'Gerente de Conta Dedicado',
		'reports_weekly': 'Relatório Semanal',
		'reports_custom': 'Relatório Personalizado',
		'analytics_advanced': 'Analytics Avançado',
		'training': 'Treinamento da Equipa',
		'documentation': 'Documentação Técnica',
		'consulting': 'Consultoria Estratégica',
		'migration': 'Auxílio à Migração',
		'maintenance_preventive': 'Manutenção Preventiva'
	},
	extrasList: {
		'support_247': '• Suporte 24/7 Priority',
		'backup_realtime': '• Backup em Tempo Real',
		'ssl_premium': '• SSL Premium + Wildcard',
		'cdn': '• CDN Premium Global',
		'security_audit': '• Auditoria de Segurança Trimestral',
		'dedicated_manager': '• Gerente de Conta Dedicado',
		'reports_weekly': '• Relatório Semanal',
		'reports_custom': '• Relatório Personalizado',
		'analytics_advanced': '• Analytics Avançado',
		'training': '• Treinamento da Equipa',
		'documentation': '• Documentação Técnica',
		'consulting': '• Consultoria Estratégica',
		'migration': '• Auxílio à Migração',
		'maintenance_preventive': '• Manutenção Preventiva'
	},
	responseTime: { '1h': '1 hora (24/7)', '4h': '4 horas', '24h': '24 horas' },
	criticalTimeText: { 'premium': 'Imediata (24/7)', 'balanced': '24h', 'economy': '2-3 dias' },
	backup: { 'realtime': 'Tempo real', 'daily': 'Diário', 'weekly': 'Semanal' },
	backupText: { 'realtime': 'Tempo real', 'daily': 'Diário', 'weekly': 'Semanal' },
	communication: {
		'email': 'E-mail',
		'whatsapp': 'WhatsApp',
		'call': 'Telefone',
		'video': 'Zoom/Teams'
	},
	communicationText: {
		'email': 'E-mail',
		'whatsapp': 'WhatsApp',
		'call': 'Telefone',
		'video': 'Zoom/Teams'
	},
	plans: {
		'starter': 'Starter',
		'professional': 'Professional',
		'enterprise': 'Enterprise'
	},
	paymentPeriod: {
		'monthly': '/mês',
		'quarterly': '/mês (-10%)',
		'semiannual': '/mês (-15%)'
	},
	get(category, key) { return this[category]?.[key] || key; }
};

function addTooltip(text) {
    const term = Object.keys(GLOSSARY).find(k => text.includes(k));
    if (!term) return text;
    const idx = text.indexOf(term);
    const before = text.slice(0, idx);
    const after = text.slice(idx + term.length);
    if (!before && !after) return text;
    return before +
        `<span class="tooltip-trigger">?<span class="tooltip-text">${GLOSSARY[term]}</span></span>` +
        after;
}

function renderQuestion(q) {
    let html = '';
    const hasDescription = q.description;
    const labelHtml = addTooltip(q.label);
    
    if (q.conditional_on) {
        html += `<div class="conditional-field hidden mb-7" data-show-if="${q.conditional_on}">`;
    } else {
        html += `<div class="mb-7">`;
    }
    
    if (hasDescription) {
        html += `<label class="block text-base font-semibold text-slate-800 mb-2">${labelHtml}</label>`;
        html += `<p class="text-sm text-slate-500 mb-4">${addTooltip(q.description)}</p>`;
    } else {
        html += `<label class="block text-base font-semibold text-slate-800 mb-2">${labelHtml}</label>`;
    }

    if (q.type === 'radio' || q.type === 'radio-grid') {
        const isGrid = q.type === 'radio-grid';
        const gridClass = isGrid ? 'grid grid-cols-2 md:grid-cols-4 gap-3' : 'space-y-3';
        
        html += `<div class="${gridClass}">`;
        q.options.forEach(opt => {
            const isDefault = opt.default ? 'selected' : '';
            const checked = opt.default ? 'checked' : '';
            const sublabel = opt.sublabel ? `<span class="text-xs text-slate-400 mt-1">${opt.sublabel}</span>` : '';
            const desc = opt.desc ? `<p class="text-xs text-slate-500 mt-1">${addTooltip(opt.desc)}</p>` : '';
            
            if (isGrid) {
                html += `
                    <label class="option-card flex flex-col items-center p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition-all text-center bg-white ${isDefault}">
                        <input type="radio" name="${q.name}" value="${opt.value}" class="w-4 h-4 text-primary-600 mb-2" ${checked}>
                        <span class="font-semibold text-sm text-slate-700">${opt.label}</span>
                        ${sublabel}
                    </label>
                `;
            } else {
                html += `
                    <label class="option-card flex items-start p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition-all bg-white ${isDefault}">
                        <input type="radio" name="${q.name}" value="${opt.value}" class="w-5 h-5 text-primary-600 mt-0.5" ${checked}>
                        <div class="ml-3">
                            <span class="font-semibold text-slate-700">${opt.label}</span>
                            <span class="text-xs text-slate-400 ml-2">${opt.sublabel || ''}</span>
                            ${desc}
                        </div>
                    </label>
                `;
            }
        });
        html += `</div>`;
    } 
    else if (q.type === 'checkbox' || q.type === 'checkbox-grid') {
        const isGrid = q.type === 'checkbox-grid';
        const gridClass = isGrid ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-2';
        
        if (q.price) {
            html += `<div class="${gridClass}">`;
            q.options.forEach(opt => {
                html += `
                    <label class="checkbox-card flex items-center justify-between p-4 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/50 transition-all bg-white">
                        <div class="flex items-center">
                            <input type="checkbox" name="${q.name}" value="${opt.value}" class="w-5 h-5 text-primary-600 rounded-lg">
                            <div class="ml-3">
                                <span class="font-semibold text-sm text-slate-700">${addTooltip(opt.label)}</span>
                                <p class="text-xs text-slate-500">${addTooltip(opt.desc)}</p>
                            </div>
                        </div>
                        <span class="text-primary-600 font-bold text-sm">+USD ${opt.price}/mês</span>
                    </label>
                `;
            });
            html += `</div>`;
        } else {
            html += `<div class="${gridClass}">`;
            q.options.forEach(opt => {
                html += `
                    <label class="flex items-center p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all bg-white">
                        <input type="checkbox" name="${q.name}" value="${opt.value}" class="w-5 h-5 text-primary-600 rounded-lg">
                        <span class="ml-3 font-medium text-slate-700">${addTooltip(opt.label)}</span>
                    </label>
                `;
            });
            html += `</div>`;
        }
    } 
    else if (q.type === 'select') {
        html += `<select name="${q.name}" class="w-full p-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-700 font-medium focus:border-primary-500 transition-all">`;
        q.options.forEach(opt => {
            const selected = opt.default ? 'selected' : '';
            html += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
        });
        html += `</select>`;
    } 
    else if (q.type === 'textarea') {
        html += `<textarea name="${q.name}" rows="3" placeholder="${q.placeholder}" class="w-full p-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-700 font-medium placeholder:text-slate-400 focus:border-primary-500 transition-all"></textarea>`;
    } 
    else if (q.type === 'number') {
        const min = q.min !== undefined ? `min="${q.min}"` : '';
        const max = q.max !== undefined ? `max="${q.max}"` : '';
        const defaultVal = q.default !== undefined ? `value="${q.default}"` : '';
        html += `<input type="number" name="${q.name}" ${min} ${max} ${defaultVal} placeholder="${q.placeholder || '0'}" class="w-full p-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-700 font-medium placeholder:text-slate-400 focus:border-primary-500 transition-all">`;
        if (q.price_per_hour) {
            html += `<p class="text-sm text-slate-500 mt-2">USD ${q.price_per_hour}/hora</p>`;
        } else if (q.price_per_unit) {
            html += `<p class="text-sm text-slate-500 mt-2">USD ${q.price_per_unit} por pessoa</p>`;
        }
    } 
    else if (q.type === 'fields') {
        html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-3">`;
        q.fields.forEach(field => {
            const isPhone = field.type === 'tel';
            const isEmail = field.type === 'email';
            const icon = isPhone
                ? `<svg class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`
                : isEmail
                ? `<svg class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`
                : '';
            const pl = (isPhone || isEmail) ? 'pl-12' : '';
            html += `<div class="relative">
                ${icon}
                <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" class="w-full p-4 ${pl} border-2 border-slate-200 rounded-2xl bg-white text-slate-700 font-medium placeholder:text-slate-400 focus:border-primary-500 transition-all">
            </div>`;
        });
        html += `</div>`;
    }

    html += `</div>`;
    
    if (q.conditional_on) {
        html += `</div>`;
    }
    return html;
}

function updateProgress() {
    try {
        DOMUtils.updateText('#progress-text', `${currentStep} de ${totalSteps}`);

        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
        }

        DOMUtils.toggleClass(document.getElementById('prev-btn'), 'hidden', currentStep === 1);
        DOMUtils.updateText('#next-btn', currentStep === totalSteps ? 'Calcular Orçamento →' : 'Próximo →');

        updateStepTitles();
    } catch (error) {
        ErrorHandler.handle(error, 'Atualização de progresso');
    }
}

function renderStepLabels() {
    const container = document.getElementById('step-labels');
    if (!formData || !formData.steps) return;
    let html = '';
    for (let i = 0; i < formData.steps.length; i++) {
        const step = formData.steps[i];
        const label = step.shortTitle || step.title;
        html += `<span class="whitespace-nowrap step-label">${label}</span>`;
    }
    container.innerHTML = html;
}

function updateStepTitles() {
    const isMobile = window.innerWidth < 640;
    const stepLabels = document.querySelectorAll('.step-label');
    formData.steps.forEach((step, index) => {
        if (!stepLabels[index]) return;
        stepLabels[index].textContent = step.shortTitle || step.title;
        const isCurrent = index + 1 === currentStep;
        stepLabels[index].classList.toggle('text-primary-600', isCurrent);
        stepLabels[index].classList.toggle('font-bold', isCurrent);
        stepLabels[index].classList.toggle('text-slate-400', !isCurrent);
        if (isMobile) {
            const nearCurrent = Math.abs(index + 1 - currentStep) <= 1;
            stepLabels[index].classList.toggle('hidden', !nearCurrent);
        } else {
            stepLabels[index].classList.remove('hidden');
        }
    });
}

function applyInputMask(input) {
    const name = input.name;

    if (name === 'emergency_phone') {
        input.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 12);
            if (v.length > 3 && v.length <= 6) {
                v = `(${v.slice(0, 3)}) ${v.slice(3)}`;
            } else if (v.length > 6) {
                v = `(${v.slice(0, 3)}) ${v.slice(3, 6)} ${v.slice(6)}`;
            }
            e.target.value = v;
        });
    }

    if (name === 'company_email') {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\s/g, '').toLowerCase();
        });
    }

    if (name === 'company_name') {
        input.addEventListener('input', (e) => {
            const pos = e.target.selectionStart;
            const len = e.target.value.length;
            e.target.value = e.target.value.replace(/^\s+/, '');
            const diff = e.target.value.length - len;
            e.target.setSelectionRange(pos + diff, pos + diff);
        });
    }
}

function setupEventListeners() {
    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentStep < totalSteps) {
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
            currentStep++;
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
            updateProgress();
            persistFormData();
        } else {
            calculateBudget();
        }
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentStep > 1) {
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
            currentStep--;
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
            updateProgress();
            persistFormData();
        }
    });

    setTimeout(() => {
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                handleRadioChange(e);
                persistFormData();
            });
        });

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                handleCheckboxChange(e);
                persistFormData();
            });
        });

        document.querySelectorAll('select, textarea, input[type="text"], input[type="email"], input[type="tel"], input[type="number"]').forEach(el => {
            el.addEventListener('change', persistFormData);
            applyInputMask(el);
        });
    }, 100);
}

function handleRadioChange(e) {
    try {
        const parent = e.target.closest('.option-card') || e.target.closest('.flex');
        if (parent && parent.parentElement) {
            const siblings = parent.parentElement.querySelectorAll('.option-card, .flex');
            siblings.forEach(card => {
                DOMUtils.toggleClass(card, 'selected', false);
                DOMUtils.toggleClass(card, 'border-primary-500', false);
                DOMUtils.toggleClass(card, 'bg-primary-50', false);
            });
            DOMUtils.toggleClass(parent, 'selected', true);
        }
    } catch (error) {
        ErrorHandler.handle(error, 'Seleção de opção');
    }
}

function handleCheckboxChange(e) {
    try {
        const checkbox = e.target;
        const parent = checkbox.closest('.checkbox-card');
        if (parent) {
            DOMUtils.toggleClass(parent, 'selected', checkbox.checked);
        }
        
        const value = checkbox.value;
        const conditionalFields = document.querySelectorAll(`.conditional-field[data-show-if="${value}"]`);
        conditionalFields.forEach(field => {
            DOMUtils.toggleClass(field, 'hidden', !checkbox.checked);
            if (checkbox.checked) {
                const input = field.querySelector('input');
                if (input && !input.value) {
                    input.value = input.getAttribute('min') || 1;
                }
            }
        });
    } catch (error) {
        ErrorHandler.handle(error, 'Seleção de checkbox');
    }
}

async function submitToNetlify(budgetData) {
    try {
        const form = document.getElementById('budget-form');
        const fd = new FormData(form);

        fd.append('plan', budgetData.plan);
        fd.append('monthly_price', budgetData.monthlyPrice);
        fd.append('discounted_price', budgetData.discountedPrice);
        fd.append('discount_label', budgetData.discountLabel);
        fd.append('setup_fee', budgetData.setupFee);
        fd.append('total_3months', budgetData.total3Months);
        fd.append('extras_selected', budgetData.extras.join(', '));
        fd.append('plan_details', budgetData.planDetails.join(' | '));

        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(fd).toString()
        });

        if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
        showNotification('Orçamento enviado com sucesso!', 'success');
    } catch (error) {
        console.error('Netlify Forms:', error);
        showNotification('Orçamento calculado. O envio automático falhou, mas pode usar o WhatsApp.', 'warning');
    }
}

function showNotification(message, type) {
    let el = document.getElementById('netlify-notification');
    if (el) el.remove();

    const colors = {
        success: 'bg-green-50 border-green-300 text-green-800',
        warning: 'bg-amber-50 border-amber-300 text-amber-800',
        error: 'bg-red-50 border-red-300 text-red-800'
    };

    el = document.createElement('div');
    el.id = 'netlify-notification';
    el.className = `fixed top-4 right-4 max-w-sm ${colors[type] || colors.success} border-2 rounded-2xl p-4 z-50 animate-fade-in no-print`;
    const icon = type === 'success' ? '✓' : '⚠';
    el.innerHTML = `<div class="flex items-center gap-3"><span class="text-xl">${icon}</span><div><p class="font-semibold">${message}</p></div><button onclick="document.getElementById('netlify-notification').remove()" class="ml-auto font-bold opacity-60 hover:opacity-100">✕</button></div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
}

function calculateBudget() {
    const form = document.getElementById('budget-form');
    const formDataObj = new FormData(form);
    
    let plan = 'professional';
    const criticalTime = formDataObj.get('critical_time');
    const backup = formDataObj.get('backup');
    const uptime = formDataObj.get('uptime');

    if (criticalTime === 'premium' || uptime === '99.9' || backup === 'realtime') {
        plan = 'enterprise';
    } else if (criticalTime === 'economy' && backup === 'weekly') {
        plan = 'starter';
    }

    const basePlan = formData.pricing.plans[plan];
    let basePrice = basePlan.price;

    let extrasPrice = 0;
    let features = [];
    let planDetails = [];

    const meetingFrequency = formDataObj.get('meeting_frequency');
    if (formData.pricing.meeting[meetingFrequency] > 0) {
        extrasPrice += formData.pricing.meeting[meetingFrequency];
        const meetingLabel = LABEL_MAPPINGS.get('meeting', meetingFrequency);
        features.push(meetingLabel);
        planDetails.push(`${meetingLabel}: USD ${formData.pricing.meeting[meetingFrequency]}/mês`);
    }

    const communication = formDataObj.get('communication');
    if (communication === 'video') {
        extrasPrice += formData.pricing.video_call;
        features.push('Suporte por videoconferência');
        planDetails.push(`Videoconferência (Zoom/Teams): USD ${formData.pricing.video_call}/mês`);
    }

    const selectedExtras = formDataObj.getAll('extras');
    selectedExtras.forEach(extra => {
        let extraPrice = formData.pricing.extras[extra] || 0;
        
        if (extra === 'training') {
            const trainingPeople = parseInt(formDataObj.get('training_people')) || 1;
            extraPrice = extraPrice * trainingPeople;
            features.push(`Treinamento (${trainingPeople} pessoas)`);
            planDetails.push(`Treinamento (${trainingPeople} pessoas): USD ${extraPrice} (uma vez)`);
        } else {
            features.push(LABEL_MAPPINGS.get('extras', extra));
            planDetails.push(`${LABEL_MAPPINGS.get('extras', extra)}: USD ${extraPrice}/mês`);
        }
        
        extrasPrice += extraPrice;
    });

    const devHours = parseInt(formDataObj.get('dev_hours')) || 0;
    if (devHours > 0) {
        const devHoursPrice = devHours * (formData.pricing.dev_hour_price || 50);
        extrasPrice += devHoursPrice;
        features.push(`${devHours}h desenvolvimento/mês extra`);
        planDetails.push(`${devHours}h desenvolvimento extra: USD ${devHoursPrice}/mês`);
    }

    const slaLabel = LABEL_MAPPINGS.get('criticalTimeText', criticalTime);
    features.push(`SLA: resposta em ${slaLabel}`);

    const totalMonthly = basePrice + extrasPrice;
    
    const paymentPeriod = formDataObj.get('payment_period');
    const discounts = { 'monthly': 1, 'quarterly': 0.9, 'semiannual': 0.85 };
    const discount = discounts[paymentPeriod] || 1;

    const finalPrice = Math.round(totalMonthly * discount);
    const discountLabel = LABEL_MAPPINGS.get('paymentPeriod', paymentPeriod);

    const setupFee = formData.pricing.setupFee;
    const total3Months = setupFee + (finalPrice * 3);

    document.getElementById('plan-name').textContent = LABEL_MAPPINGS.get('plans', plan);
    document.getElementById('monthly-price').textContent = `USD ${totalMonthly}`;
    document.getElementById('discounted-price').textContent = `USD ${finalPrice}${discountLabel}`;

    document.getElementById('plan-details').innerHTML = planDetails.map(d => `
        <div class="flex justify-between border-b border-slate-100 py-2">
            <span class="text-slate-600">${d.split(':')[0]}</span>
            <span class="font-medium">${d.split(':')[1] || ''}</span>
        </div>
    `).join('');

    document.getElementById('features-list').innerHTML = [...formData.features[plan], ...features].map(f => `
        <li class="flex items-center gap-2">
            <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            ${f}
        </li>
    `).join('');

    document.getElementById('total-3months').textContent = `USD ${total3Months}`;

    document.getElementById('budget-form').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    persistFormData();

    submitToNetlify({
        plan,
        monthlyPrice: totalMonthly,
        discountedPrice: finalPrice,
        discountLabel: discountLabel,
        setupFee,
        total3Months,
        extras: selectedExtras,
        planDetails
    });
}

function restartBudget() {
    localStorage.removeItem(STORAGE_KEY);
    document.getElementById('result').classList.add('hidden');
    document.getElementById('budget-form').classList.remove('hidden');
    currentStep = 1;
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelector('.step[data-step="1"]')?.classList.add('active');
    updateProgress();
}

function sendToWhatsApp() {
    const form = document.getElementById('budget-form');
    const formDataObj = new FormData(form);
    
    const companyName = document.querySelector('input[name="company_name"]').value || 'Cliente';
const companyEmail = document.querySelector('input[name="company_email"]').value || 'Não informado';
    const planName = document.getElementById('plan-name').textContent;
    const monthlyPrice = document.getElementById('monthly-price').textContent;
    const discountedPrice = document.getElementById('discounted-price').textContent;
    const total3Months = document.getElementById('total-3months').textContent;
    
    const criticalTime = formDataObj.get('critical_time');
    const backup = formDataObj.get('backup');
    const communication = formDataObj.get('communication');
    const meetingFreq = formDataObj.get('meeting_frequency');
    const extras = formDataObj.getAll('extras');

    const criticalTimeText = LABEL_MAPPINGS.get('criticalTimeText', criticalTime);
    const backupText = LABEL_MAPPINGS.get('backupText', backup);
    const commText = LABEL_MAPPINGS.get('communicationText', communication);
    const meetingText = LABEL_MAPPINGS.get('meetingShort', meetingFreq);
    
    let extrasList = '';
    if (extras.length > 0) {
        extrasList = '\n*Extras selecionados:*\n';
        extras.forEach(e => {
            let label = LABEL_MAPPINGS.get('extrasList', e);
            if (e === 'training') {
                const trainingPeople = formDataObj.get('training_people') || 1;
                label = `• ${label} (${trainingPeople} pessoas)`;
                extrasList += `${label} - USD 100/un\n`;
            } else {
                extrasList += `${label}\n`;
            }
        });
    }
    if (devHours > 0) {
        extrasList += `• ${devHours}h desenvolvimento/mês extra\n`;
    }
    
    const message = `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*💼 ORÇAMENTO YETU TECH*\n` +
        `*Plano de Sustentação*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `*📋 DADOS DO CLIENTE*\n` +
        `• Empresa: ${companyName}\n` +
        `• E-mail: ${companyEmail}\n\n` +
        `*📦 PLANO SELECIONADO*\n` +
        `• ${planName}\n\n` +
        `*💰 VALORES*\n` +
        `• Valor mensal: ${monthlyPrice}\n` +
        `• Com desconto: ${discountedPrice}\n` +
        `• Setup (uma vez): USD 500\n` +
        `• Total 3 meses: USD ${total3Months}\n` +
        `• Contrato mínimo: 3 meses\n\n` +
        `*⚙️ CONFIGURAÇÃO ESCOLHIDA*\n` +
        `• Tempo de resposta: ${criticalTimeText}\n` +
        `• Backup: ${backupText}\n` +
        `• Comunicação: ${commText}\n` +
        `• Reuniões: ${meetingText}\n` +
        `${extrasList}` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `*✅ Orçamento gerado automaticamente*\n` +
        `através do questionário online Yetu Tech\n\n` +
        `Para discutir detalhes ou esclarecer\n` +
        `dúvidas, entre em contacto connosco.`;
    
    const whatsappUrl = `https://wa.me/244923493802?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function printBudget() {
    const dateEl = document.getElementById('print-date');
    const now = new Date();
    dateEl.textContent = `Gerado em ${now.toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}`;
    window.print();
}

init();