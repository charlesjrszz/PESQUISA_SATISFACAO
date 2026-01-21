var oauth = '';

var token = {
    key: 'fa4d7b2e-f2e3-4f07-962b-2ec0187cdba9',
    secret: '0e1a4d17-11c0-40b6-89e4-d33dda50ae46baa6a5ef-77df-4205-a848-666be908d4ef',
}

// Declara as variáveis aqui fora
var loadingOverlay;
var successModal;
var errorModal;

var MyWidget = SuperWidget.extend({
    // Variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    // Método iniciado quando a widget é carregada
    init: function () {
        loadingOverlay = $('#loading-overlay');
        successModal = $('#success-modal');
        errorModal = $('#error-modal');

        // Inicializa OAuth (Requer libs sha256 e OAuth carregadas no HTML)
        oauth = OAuth({
            consumer: {
                'key': 'getTeste',
                'secret': 'getTeste'
            },
            signature_method: 'HMAC-SHA256',
            hash_function: function (base_string, key) {
                var hashHex = sha256.hmac(key, base_string);
                return hexToBase64(hashHex);
            }
        });  
    },

    // BIND de eventos
    bindings: {
        local: {
            'enviar': ['click_enviarSolicitscao']
        },
        global: {}
    },

    // Ação do botão de enviar
    enviarSolicitscao: async function (htmlElement, event) {

        // Validações
        if ($("#cliente").val() == "") {
            alertError("Cliente");
            return false;
        }



        // A validação passou. Mostra o ecrã de carregamento.
        mostrarLoading();

        try {
            // 'await' espera que startProcesAsync termine.
            var data = await startProcesAsync();
            var numProtocolo = data.processInstanceId;

            // TUDO correu bem. Esconde o carregamento.
            esconderLoading();

            // Atualiza e mostra a mensagem de sucesso
            $('#success-modal h3').text('Integrado com Sucesso!');
            $('#success-modal p').html('O registo foi concluído.<br>Protocolo: <strong>' + numProtocolo + '</strong>');
            mostrarSucesso();

            // Limpa o formulário (Ajustado ID para garantir consistência)
            $("#form")[0].reset();

        } catch (error) {
            // Se algo der ERRO
            console.error("Erro no processo de envio:", error);
            esconderLoading();

            var msgErro = error.message || "Não foi possível completar a solicitação.";
            
            // Tenta pegar mensagem de erro detalhada do Fluig se existir
            if(error.responseJSON && error.responseJSON.message) {
                msgErro = error.responseJSON.message;
            }

            $('#error-modal p').text(msgErro);
            mostrarErro();
        }
    } 
}); // Fim do SuperWidget.extend


// --- Funções Auxiliares (Fora do Widget) ---

function alertError(campo) {
    FLUIGC.toast({
        title: 'Atenção: ',
        message: 'O campo ' + campo + ' é obrigatório',
        type: 'danger'
    });
}

function selectRating(valor, element) {
    $(".rating-item").removeClass("selected");
    $(element).addClass("selected");
    $("#avaliacao_valor").val(valor);
}

function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function startProcesAsync() {
    var obj = {};
    var request_data = {
        // Garanta que o código do processo 'dgr_LFM001' está correto
        url: parent.WCMAPI.serverURL + `/process-management/api/v2/processes/PESQUISA_SATISFACAO/start`,
        method: 'POST'
    }
    
    var data = {
        "targetState": 0,
        "targetAssignee": "",
        "subProcessTargetState": 0,
        "comment": "Processo iniciado por página pública",
        "formFields": {}
    }

    // Coleta dados do form correto
    $("#form").serializeArray().forEach(field => {
        obj[field.name] = field.value
    })
    data.formFields = obj;

    return $.ajax({
        url: request_data.url,
        type: request_data.method,
        data: JSON.stringify(data),
        contentType: "application/json; charset=UTF-8",
        headers: oauth.toHeader(oauth.authorize(request_data, token))
    });
}

// Funções de UI (Loading e Modais)
function mostrarLoading() {
    if (loadingOverlay) loadingOverlay.removeClass('loading-hidden');
}

function esconderLoading() {
    if (loadingOverlay) loadingOverlay.addClass('loading-hidden');
}

function mostrarSucesso() {
    if (successModal) successModal.removeClass('modal-hidden');
}

function mostrarErro() {
    if (errorModal) errorModal.removeClass('modal-hidden');
}

function esconderSucesso() {
    if (successModal) successModal.addClass('modal-hidden');
}

function esconderErro() {
    if (errorModal) errorModal.addClass('modal-hidden');
}
