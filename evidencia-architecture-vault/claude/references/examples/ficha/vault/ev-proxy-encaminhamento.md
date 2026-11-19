---
id: "ev-proxy-encaminhamento"
afirmacao: "[[af-proxy-encaminhamento]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/nginx.conf"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de nginx.conf em ingresso.txt, linhas 6–7"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/ingresso.txt"
sha256: "a7947ae52839cebe7c00d24681b333ac816bb9d2303284d614e54aa97ba3d88b"
linha_inicial: 6
linha_final: 7
---
# ev-proxy-encaminhamento

O trecho vincula a diretiva ao recorte configurado desta implantação sintética.

## Trecho verificado

~~~text
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
~~~

[Arquivo sanitizado completo](provas/ingresso.txt)
