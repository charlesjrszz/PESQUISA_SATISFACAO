<div id="WgtPesquisaSatisfacao_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">

    <script type="text/javascript" src="/wgt_pesquisa_satisfacao/resources/js/oauth-1.0a.js?v=200"></script>

    <style>
        /* Container Principal */
        #WgtPesquisaSatisfacao_${instanceId} .main-container { display: flex; justify-content: center; align-items: center; padding: 20px; }
        #WgtPesquisaSatisfacao_${instanceId} .survey-card { background: #fff; width: 100%; max-width: 700px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); overflow: hidden; position: relative; }
        
        /* Cabeçalho e Corpo */
        #WgtPesquisaSatisfacao_${instanceId} .card-header { padding: 25px; border-bottom: 1px solid #e6e6e6; text-align: center; }
        #WgtPesquisaSatisfacao_${instanceId} .card-header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #333; }
        #WgtPesquisaSatisfacao_${instanceId} .card-body { padding: 30px 50px; text-align: center; }
        
        /* Títulos */
        #WgtPesquisaSatisfacao_${instanceId} .question-title { font-size: 18px; font-weight: 700; color: #555; margin-bottom: 10px; }
        #WgtPesquisaSatisfacao_${instanceId} .question-subtitle { font-size: 14px; color: #999; margin-bottom: 30px; }
        
        /* Opções de Nota */
        #WgtPesquisaSatisfacao_${instanceId} .rating-options { display: flex; justify-content: center; gap: 40px; margin-bottom: 30px; }
        #WgtPesquisaSatisfacao_${instanceId} .rating-item { cursor: pointer; text-align: center; opacity: 0.5; transition: all 0.3s ease; }
        #WgtPesquisaSatisfacao_${instanceId} .rating-item:hover { opacity: 0.8; transform: scale(1.05); }
        #WgtPesquisaSatisfacao_${instanceId} .rating-item.selected { opacity: 1; transform: scale(1.1); }
        #WgtPesquisaSatisfacao_${instanceId} .rating-item i { font-size: 60px; display: block; margin-bottom: 10px; }
        #WgtPesquisaSatisfacao_${instanceId} .rating-item span { font-size: 16px; font-weight: 700; display: block; }
        
        /* Cores */
        #WgtPesquisaSatisfacao_${instanceId} .rating-item.ruim i, #WgtPesquisaSatisfacao_${instanceId} .rating-item.ruim span { color: #d9534f; }
        #WgtPesquisaSatisfacao_${instanceId} .rating-item.mediano i, #WgtPesquisaSatisfacao_${instanceId} .rating-item.mediano span { color: #f0ad4e; }
        #WgtPesquisaSatisfacao_${instanceId} .rating-item.otimo i, #WgtPesquisaSatisfacao_${instanceId} .rating-item.otimo span { color: #5cb85c; }
        #WgtPesquisaSatisfacao_${instanceId} .rating-icon-wrapper { display: inline-block; border-radius: 50%; padding: 5px; }
        
        /* Formulário e Botões */
        #WgtPesquisaSatisfacao_${instanceId} .comment-area textarea { width: 100%; height: 80px; border: 1px solid #ccc; border-radius: 4px; padding: 10px; resize: none; font-size: 14px; color: #555; }
        #WgtPesquisaSatisfacao_${instanceId} .btn-submit-container { text-align: center; margin-top: 20px; margin-bottom: 20px; }
        #WgtPesquisaSatisfacao_${instanceId} .btn-custom-send { background-color: #555; color: white; padding: 12px 30px; font-size: 16px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s; }
        #WgtPesquisaSatisfacao_${instanceId} .btn-custom-send:hover { background-color: #333; }
        
        /* Utilitários */
        .hidden-fields { display: none; }
        .modal-hidden { display: none !important; }
        .loading-hidden { display: none !important; }

        /* LOADING */
        #loading-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.9); z-index: 100;
            display: flex; justify-content: center; align-items: center; flex-direction: column;
        }
        .spinner {
            border: 8px solid #f3f3f3; border-top: 8px solid #3498db;
            border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin-bottom: 15px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* MODAIS */
        .custom-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
        }
        .custom-modal-box {
            background: #fff; padding: 30px; border-radius: 8px; width: 90%; max-width: 400px;
            text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .custom-modal-box h3 { margin-top: 0; color: #333; }
        .custom-modal-box i { font-size: 50px; margin-bottom: 20px; display: block; }
        .text-success { color: #5cb85c; }
        .text-danger { color: #d9534f; }
        .btn-modal-close {
            margin-top: 20px; padding: 8px 20px; border: none; border-radius: 4px;
            background: #eee; cursor: pointer; font-weight: bold;
        }
        .btn-modal-close:hover { background: #ddd; }
    </style>

    <form name="form" id="form" role="form">
        <div class="hidden-fields">
            <input type="hidden" name="avaliacao_valor" id="avaliacao_valor">
        </div>

        <div class="main-container">
            <div class="survey-card">
                
                <div id="loading-overlay" class="loading-hidden">
                    <div class="spinner"></div>
                    <p>Enviando sua avaliação...</p>
                </div>

                <div class="card-header">
                    <h2>Pesquisa de Satisfação</h2>
                </div>
                <div class="card-body">
                    <div class="question-title">O que você achou do nosso atendimento?</div>
                    <div class="question-subtitle">Selecione uma opção abaixo:</div>

                    <div class="rating-options">
                        <div class="rating-item ruim" onclick="selectRating('ruim', this)">
                            <div class="rating-icon-wrapper"><i class="flaticon flaticon-face-sad" aria-hidden="true"></i></div>
                            <span>Ruim</span>
                        </div>
                        <div class="rating-item mediano" onclick="selectRating('mediano', this)">
                            <div class="rating-icon-wrapper"><i class="flaticon flaticon-face-neutral" aria-hidden="true"></i></div>
                            <span>Mediano</span>
                        </div>
                        <div class="rating-item otimo" onclick="selectRating('otimo', this)">
                            <div class="rating-icon-wrapper"><i class="flaticon flaticon-face-smile" aria-hidden="true"></i></div>
                            <span>Ótimo</span>
                        </div>
                    </div>

                    <div class="comment-area">
                        <textarea name="comentario" id="comentario" class="form-control" placeholder="Deixe um comentário (opcional)"></textarea>
                    </div>

                    <div class="btn-submit-container">
                        <button type="button" class="btn-custom-send" data-enviar>Enviar Avaliação</button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div id="success-modal" class="custom-modal-overlay modal-hidden">
        <div class="custom-modal-box">
            <i class="flaticon flaticon-check-circle text-success"></i>
            <h3>Obrigado!</h3>
            <p>Sua avaliação foi enviada.</p>
            <button type="button" class="btn-modal-close" id="success-modal-close">Fechar</button>
        </div>
    </div>

    <div id="error-modal" class="custom-modal-overlay modal-hidden">
        <div class="custom-modal-box">
            <i class="flaticon flaticon-alert text-danger"></i>
            <h3>Ops!</h3>
            <p>Ocorreu um erro ao enviar.</p>
            <button type="button" class="btn-modal-close" id="error-modal-close">Tentar Novamente</button>
        </div>
    </div>

</div>