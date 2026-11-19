---
id: "ev-acesso-recurso-2"
afirmacao: "[[af-acesso-recurso]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/acesso.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de acesso.py distribuído como acesso.txt, linhas 2–5"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/acesso.txt"
sha256: "1834aa35063d842d063c466d53fb5503a7d22976c566058e9210c2bf44b7e4b8"
linha_inicial: 2
linha_final: 5
---
# ev-acesso-recurso-2

A rota chama o guard com o usuário e o ID do recurso. O guard consulta o vínculo e decide a recusa.

## Trecho verificado

~~~text
async def exigir_acesso_ao_repositorio(usuario, repo_id, db):
    vinculo = await vinculos.para_usuario_e_repositorio(db, usuario.id, repo_id)
    if vinculo is None:
        raise HTTPException(status_code=403)
~~~

[Arquivo sanitizado completo](provas/acesso.txt)
