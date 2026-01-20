<link type="text/css" rel="stylesheet" href="/style-guide/css/fluig-style-guide.min.css"/>
<script type="text/javascript" src="/portal/resources/js/jquery/jquery.js"></script>
<script type="text/javascript" src="/portal/resources/js/jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="/portal/resources/js/mustache/mustache-min.js"></script>
<script type="text/javascript" src="/style-guide/js/fluig-style-guide.min.js" charset="utf-8"></script>

<script type="text/javascript" src="/wgt_pesquisa_satisfacao/resources/js/sha256.min.js"></script>
<script type="text/javascript" src="/wgt_pesquisa_satisfacao/resources/js/oauth-1.0a.js"></script>
<script type="text/javascript" src="/wgt_pesquisa_satisfacao/resources/js/custom.js?v=3"></script>

<style>
    /* Estilos copiados do seu formulário */
    .wgt-pesquisa-container { background-color: #f9f9f9; font-family: 'Open Sans', sans-serif; padding: 20px; }
    .main-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
    .survey-card { background: #fff; width: 100%; max-width: 700px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); overflow: hidden; }
    
    .card-header { padding: 25px; border-bottom: 1px solid #e6e6e6; text-align: center; }
    .card-header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #333; }
    
    .card-body { padding: 30px 50px; text-align: center; }
    .question-title { font-size: 18px; font-weight: 700; color: #555; margin-bottom: 10px; }
    .question-subtitle { font-size: 14px; color: #999; margin-bottom: 30px; }
    
    /* Ícones */
    .rating-options { display: flex; justify-content: center; gap: 40px; margin-bottom: 30px; }
    .rating-item { cursor: pointer; text-align: center; opacity: 0.5; transition: all 0.3s ease; }
    .rating-item:hover { opacity: 0.8; transform: scale(1.05); }
    .rating-item.selected { opacity: 1; transform: scale(1.1); }
    .rating-item i { font-size: 60px; display: block; margin-bottom: 10px; }
    .rating-item span { font-size: 16px; font-weight: 700; display: block; }
    
    /* Cores */
    .rating-item.ruim i, .rating-item.ruim span { color: #d9534f; }
    .rating-item.mediano i, .rating-item.mediano span { color: #f0ad4e; }
    .rating-item.otimo i, .rating-item.otimo span { color: #5cb85c; }
    .rating-icon-wrapper { display: inline-block; border-radius: 50%; padding: 5px; }
    
    .comment-area textarea { width: 100%; height: 80px; border: 1px solid #ccc; border-radius: 4px; padding: 10px; resize: none; font-size: 14px; color: #555; }
    .btn-submit-container { text-align: center; margin-top: 20px; margin-bottom: 20px; }
    .btn-custom-send { background-color: #555; color: white; padding: 12px 30px; font-size: 16px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s; }
    .btn-custom-send:hover { background-color: #333; }
    
    .hidden-fields { display: none; }
</style>

<div id="PesquisaSatisfacao_${instanceId}" class="fluig-style-guide wgt-pesquisa-container">
    <form name="form" role="form">
        <div class="hidden-fields">
            <input type="hidden" name="avaliacao_valor" id="avaliacao_valor">
        </div>

        <div class="main-container">
            <div class="survey-card">
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
                        <button type="button" class="btn-custom-send" onclick="iniciarProcessoViaAPI()">Enviar Avaliação</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>