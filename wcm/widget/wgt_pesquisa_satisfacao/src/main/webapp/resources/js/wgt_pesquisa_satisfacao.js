var oauth = '';

// Tokens de Acesso
var token = {
    key: 'fa4d7b2e-f2e3-4f07-962b-2ec0187cdba9',
    secret: '0e1a4d17-11c0-40b6-89e4-d33dda50ae46baa6a5ef-77df-4205-a848-666be908d4ef'
};

var loadingOverlay;
var successModal;
var errorModal;

// Função auxiliar Hex -> Base64
function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

var WgtPesquisaSatisfacao = SuperWidget.extend({
    init: function () {
        var self = this;
        loadingOverlay = $('#loading-overlay');
        successModal = $('#success-modal');
        errorModal = $('#error-modal');

        // Configuração OAuth (SHA256)
        oauth = OAuth({
            consumer: {
                'key': 'getTeste',
                'secret': 'getTeste'
            },
            signature_method: 'HMAC-SHA256',
            hash_function: function(base_string, key) {
                var hashHex = sha256.hmac(key, base_string);
                return hexToBase64(hashHex);
            }
        });

        $('#success-modal-close').on('click', function () { esconderSucesso(); });
        $('#error-modal-close').on('click', function () { esconderErro(); });
    },

    bindings: {
        local: { 'enviar': ['click_enviarSolicitscao'] },
        global: {}
    },

    // Removido 'async' para o Eclipse não reclamar
    enviarSolicitscao: function (htmlElement, event) {
        var self = this;
        
        // Validação
        if ($("#avaliacao_valor").val() == "") {
            alertError("Por favor, selecione uma nota.");
            return false;
        }

        mostrarLoading();

        // Substituído 'await' por '.then()' (Padrão compatível com Eclipse)
        startProcesAsync().then(function(data) {
            // SUCESSO
            var numProtocolo = data.processInstanceId;

            esconderLoading();

            $('#success-modal h3').text('Sucesso!');
            $('#success-modal p').html('Pesquisa enviada.<br>Protocolo: <strong>' + numProtocolo + '</strong>');
            mostrarSucesso();

            if($("#form")[0]) $("#form")[0].reset();
            $("#avaliacao_valor").val("");
            $(".rating-item").removeClass("selected");

        }, function(error) {
            // ERRO
            console.error("Erro envio:", error);
            esconderLoading();

            var msgErro = "Erro ao enviar solicitação.";
            if (error.responseJSON && error.responseJSON.message) {
                msgErro = error.responseJSON.message;
            } else if (error.responseText) {
                 var tmp = document.createElement("DIV");
                 tmp.innerHTML = error.responseText;
                 msgErro = tmp.textContent || tmp.innerText || error.responseText;
            }

            $('#error-modal p').text(msgErro);
            mostrarErro();
        });
    }
});

function startProcesAsync() {
    var processId = "PESQUISA_SATISFACAO"; 
    
    var request_data = {
        url: parent.WCMAPI.serverURL + '/process-management/api/v2/processes/' + processId + '/start',
        method: 'POST'
    };

    var obj = {};
    $("#form").serializeArray().forEach(function(field) {
        obj[field.name] = field.value;
    });
    
    obj["avaliacao_valor"] = $("#avaliacao_valor").val();

    var payload = {
        "targetState": 0,             
        "subProcessTargetState": 0,   
        "comment": "Iniciado via Widget Público",
        "formFields": obj
    };

    var headers = oauth.toHeader(oauth.authorize({
        url: request_data.url,
        method: request_data.method,
        data: {} 
    }, token));

    return $.ajax({
        url: request_data.url,
        type: request_data.method,
        data: JSON.stringify(payload),
        contentType: "application/json; charset=UTF-8",
        headers: { "Authorization": headers.Authorization }
    });
}

// Funções Visuais
function alertError(msg) { FLUIGC.toast({ title: 'Atenção:', message: msg, type: 'warning' }); }
function mostrarLoading() { if (loadingOverlay) loadingOverlay.removeClass('loading-hidden'); }
function esconderLoading() { if (loadingOverlay) loadingOverlay.addClass('loading-hidden'); }
function mostrarSucesso() { if (successModal) successModal.removeClass('modal-hidden'); }
function mostrarErro() { if (errorModal) errorModal.removeClass('modal-hidden'); }
function esconderSucesso() { if (successModal) successModal.addClass('modal-hidden'); }
function esconderErro() { if (errorModal) errorModal.addClass('modal-hidden'); }