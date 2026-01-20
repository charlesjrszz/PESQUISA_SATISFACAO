// Arquivo: resources/js/custom.js

var configs = {
    processId: 'PESQUISA_SATISFACAO',
    url: window.location.protocol + "//" + window.location.host,

    token: {
        key: 'fa4d7b2e-f2e3-4f07-962b-2ec0187cdba9',
        secret: '0e1a4d17-11c0-40b6-89e4-d33dda50ae46baa6a5ef-77df-4205-a848-666be908d4ef'
    },
    
    consumer: {
        key: 'getTeste',
        secret: 'getTeste'
    }
};

function selectRating(valor, element) {
    $(".rating-item").removeClass("selected");
    $(element).addClass("selected");
    $("#avaliacao_valor").val(valor);
}

// Converte Hex para Base64 (Necessário para a assinatura)
function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function iniciarProcessoViaAPI() {
    var avaliacao = $("#avaliacao_valor").val();
    var comentario = $("#comentario").val();

    if (!avaliacao) {
        FLUIGC.toast({ title: 'Atenção: ', message: 'Por favor, selecione uma nota.', type: 'warning' });
        return;
    }
    
    var $btn = $(".btn-custom-send");
    var textoOriginal = $btn.text();
    $btn.prop("disabled", true).text("Enviando...");

    var dadosProcesso = {
        targetState: 0,
        subProcessTargetState: 0,
        comment: "Avaliação: " + avaliacao + " | Comentário: " + comentario,
        formFields: {
            "avaliacao_valor": avaliacao,
            "comentario": comentario
        }
    };

    // --- MUDANÇA AQUI: Voltamos para HMAC-SHA1 ---
    var oauth = OAuth({
        consumer: configs.consumer,
        signature_method: 'HMAC-SHA1', // O servidor prefere este!
        hash_function: function(base_string, key) {
            // Usa a biblioteca sha1 que colocamos no arquivo
            var hashHex = sha1.hmac(key, base_string);
            return hexToBase64(hashHex);
        }
    });

    var request_data = {
        url: configs.url + '/process-management/api/v2/processes/' + configs.processId + '/start',
        method: 'POST',
        data: dadosProcesso
    };

    var token = configs.token;
    var headers = oauth.toHeader(oauth.authorize(request_data, token));

    $.ajax({
        url: request_data.url,
        type: request_data.method,
        data: JSON.stringify(dadosProcesso),
        contentType: "application/json",
        headers: {
            "Authorization": headers.Authorization
        },
        success: function(response) {
            FLUIGC.toast({ title: 'Sucesso!', message: 'Avaliação enviada!', type: 'success' });
            setTimeout(function() { window.location.reload(); }, 2000);
        },
        error: function(xhr, status, error) {
            console.error("Erro API:", xhr);
            var erroMsg = "Erro desconhecido.";
            if (xhr.responseJSON && xhr.responseJSON.message) {
                erroMsg = xhr.responseJSON.message;
            } else {
                 try {
                     var resp = JSON.parse(xhr.responseText);
                     if(resp.message) erroMsg = resp.message;
                 } catch(e) { erroMsg = xhr.responseText; }
            }
            FLUIGC.toast({ title: 'Erro: ', message: 'Falha: ' + erroMsg, type: 'danger' });
            $btn.prop("disabled", false).text(textoOriginal);
        }
    });
}