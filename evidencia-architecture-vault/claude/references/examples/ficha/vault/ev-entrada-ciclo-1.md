---
id: "ev-entrada-ciclo-1"
afirmacao: "[[af-entrada-ciclo]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/app.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de app.py distribuído como entrada.txt, linhas 2–8"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/entrada.txt"
sha256: "3dd3f85291e3ff6a3934e4c529d07e46c82a2764aed25cd251ba750a9f89c3d9"
linha_inicial: 2
linha_final: 8
---
# ev-entrada-ciclo-1

A função de contexto é registrada em FastAPI(lifespan=lifespan).

## Trecho verificado

~~~text
@asynccontextmanager
async def lifespan(app):
    async with httpx.AsyncClient(timeout=httpx.Timeout(5.0, connect=1.0)) as client:
        app.state.http = client
        yield

app = FastAPI(lifespan=lifespan)
~~~

[Arquivo sanitizado completo](provas/entrada.txt)
