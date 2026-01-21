<div id="WgtPesquisaSatisfacao_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="WgtPesquisaSatisfacao.instance()">
    <script type="text/javascript" src="/wgt_pesquisa_satisfacao/resources/js/sha256.min.js?v=200"></script>
    <script type="text/javascript" src="/wgt_pesquisa_satisfacao/resources/js/oauth-1.0a.js?v=200"></script>
    <script type="text/javascript" src="/wgt_pesquisa_satisfacao/resources/js/custom.js?v=200"></script>

    <form name="form" role="form">
        <div class="hidden-fields" style="display:none;">
            <input type="hidden" name="avaliacao_valor" id="avaliacao_valor">
        </div>

        <div class="main-container">
            <div class="survey-card">
                <div class="card-header">
                    <h2>Pesquisa de Satisfação</h2>
                </div>
                <div class="card-body">
                    <div class="question-title">O que você achou do nosso atendimento?</div>
                    <div class="rating-options">
                        <div class="rating-item ruim" onclick="selectRating('ruim', this)">
                            <span>Ruim</span>
                        </div>
                        <div class="rating-item mediano" onclick="selectRating('mediano', this)">
                            <span>Mediano</span>
                        </div>
                        <div class="rating-item otimo" onclick="selectRating('otimo', this)">
                            <span>Ótimo</span>
                        </div>
                    </div>
                    <div class="comment-area">
                        <textarea name="comentario" id="comentario" class="form-control" placeholder="Deixe um comentário (opcional)"></textarea>
                    </div>
                    <div class="btn-submit-container">
                        <button type="button" class="btn-custom-send btn btn-primary" onclick="iniciarProcessoViaAPI()">Enviar Avaliação</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>