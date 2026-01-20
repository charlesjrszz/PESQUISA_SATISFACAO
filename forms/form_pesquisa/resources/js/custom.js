// Arquivo: resources/js/custom.js

// --- CONFIGURAÇÕES E CHAVES ---
var configs = {
    processId: 'PESQUISA_SATISFACAO',
    url: window.location.protocol + "//" + window.location.host,

    // TOKEN DO USUÁRIO
    token: {
        key: 'fa4d7b2e-f2e3-4f07-962b-2ec0187cdba9',
        secret: '0e1a4d17-11c0-40b6-89e4-d33dda50ae46baa6a5ef-77df-4205-a848-666be908d4ef'
    },
    
    // CONSUMER DO APP
    consumer: {
        key: 'getTeste',
        secret: 'getTeste'
    }
};

// --- FUNÇÕES AUXILIARES ---

// Função visual: Seleciona a carinha
function selectRating(valor, element) {
    $(".rating-item").removeClass("selected");
    $(element).addClass("selected");
    $("#avaliacao_valor").val(valor);
}

// Função de conversão manual Hex -> Base64 (Resolve o conflito de versões)
function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

// Função Principal: Envia os dados
function iniciarProcessoViaAPI() {
    var avaliacao = $("#avaliacao_valor").val();
    var comentario = $("#comentario").val();

    // 1. Validação
    if (!avaliacao) {
        FLUIGC.toast({ title: 'Atenção: ', message: 'Por favor, selecione uma nota antes de enviar.', type: 'warning' });
        return;
    }
    
    // 2. Trava o botão
    var $btn = $(".btn-custom-send");
    var textoOriginal = $btn.text();
    $btn.prop("disabled", true).text("Enviando...");

    // 3. Monta o pacote de dados
    var dadosProcesso = {
        targetState: 0,
        subProcessTargetState: 0,
        comment: "Iniciado via Link Público. Avaliação: " + avaliacao,
        formFields: {
            "avaliacao_valor": avaliacao,
            "comentario": comentario
        }
    };

    // 4. Configura OAuth com Criptografia Compatível
    var oauth = OAuth({
        consumer: configs.consumer,
        signature_method: 'HMAC-SHA256',
        hash_function: function(base_string, key) {
            // AQUI ESTÁ A CORREÇÃO:
            // Gera em HEX (padrão universal) e converte para Base64 manualmente
            var hashHex = sha256.hmac(key, base_string);
            return hexToBase64(hashHex);
        }
    });

    // 5. Prepara Requisição
    var request_data = {
        url: configs.url + '/process-management/api/v2/processes/' + configs.processId + '/start',
        method: 'POST',
        data: dadosProcesso
    };

    var token = configs.token;
    var headers = oauth.toHeader(oauth.authorize(request_data, token));

    // 6. Envia via AJAX
    $.ajax({
        url: request_data.url,
        type: request_data.method,
        data: JSON.stringify(dadosProcesso),
        contentType: "application/json",
        headers: {
            "Authorization": headers.Authorization
        },
        success: function(response) {
            FLUIGC.toast({ title: 'Sucesso!', message: 'Avaliação enviada com sucesso!', type: 'success' });
            setTimeout(function() { 
                window.location.reload(); 
            }, 2000);
        },
        error: function(xhr, status, error) {
            console.error("Erro API:", xhr);
            var erroMsg = "Erro desconhecido.";
            if (xhr.responseJSON && xhr.responseJSON.message) {
                erroMsg = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                 // Às vezes o erro vem como texto puro
                 try {
                     var resp = JSON.parse(xhr.responseText);
                     if(resp.message) erroMsg = resp.message;
                 } catch(e) { erroMsg = xhr.responseText; }
            }
            
            FLUIGC.toast({ title: 'Erro: ', message: 'Falha ao enviar: ' + erroMsg, type: 'danger' });
            $btn.prop("disabled", false).text(textoOriginal);
        }
    });
}