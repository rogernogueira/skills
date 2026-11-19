---
id: "ev-proxy-timeouts"
afirmacao: "[[af-proxy-timeouts]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/nginx.conf"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de nginx.conf em ingresso.txt, linhas 4–5"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/ingresso.txt"
sha256: "a7947ae52839cebe7c00d24681b333ac816bb9d2303284d614e54aa97ba3d88b"
linha_inicial: 4
linha_final: 5
---
# ev-proxy-timeouts

O trecho vincula a diretiva ao recorte configurado desta implantação sintética.

## Trecho verificado

~~~text
    proxy_read_timeout 20s;
    proxy_send_timeout 10s;
~~~

[Arquivo sanitizado completo](provas/ingresso.txt)
