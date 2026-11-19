---
id: "ev-proxy-corpo"
afirmacao: "[[af-proxy-corpo]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/nginx.conf"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de nginx.conf em ingresso.txt, linhas 2–3"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/ingresso.txt"
sha256: "a7947ae52839cebe7c00d24681b333ac816bb9d2303284d614e54aa97ba3d88b"
linha_inicial: 2
linha_final: 3
---
# ev-proxy-corpo

O trecho vincula a diretiva ao recorte configurado desta implantação sintética.

## Trecho verificado

~~~text
location /repositorios/ {
    client_max_body_size 4m;
~~~

[Arquivo sanitizado completo](provas/ingresso.txt)
