#!/usr/bin/env python3
"""Hook PreToolUse: bloqueia publicação ou mudança de anúncio fora da allowlist.

Lê o evento do Claude Code pela entrada padrão. Sai com 0 para liberar e com 2
para bloquear (a mensagem em stderr volta para o agente). Ferramentas de leitura
passam direto. Allowlist em config/allowlist.json.
"""
import json
import os
import re
import sys

ESCRITA = re.compile(r"(create|update|delete|remove|pause|activate|enable|disable|publish|send|set|edit|duplicate|budget)", re.I)
CAMPOS_CONTA_ADS = ("ad_account_id", "account_id", "adAccountId", "act_id", "customer_id", "customerId", "advertiser_id", "advertiserId")


def bloquear(motivo):
    print(f"Bloqueado pela allowlist: {motivo}. Peça ao Marco para liberar em config/allowlist.json.", file=sys.stderr)
    sys.exit(2)


def carregar_allowlist():
    raiz = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    caminho = os.path.join(raiz, "config", "allowlist.json")
    try:
        with open(caminho, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        bloquear(f"não consegui ler {caminho}")


def achar_ids(dados, campos):
    achados = []
    if isinstance(dados, dict):
        for chave, valor in dados.items():
            if chave in campos and isinstance(valor, (str, int)):
                achados.append(str(valor).removeprefix("act_"))
            else:
                achados.extend(achar_ids(valor, campos))
    elif isinstance(dados, list):
        for item in dados:
            achados.extend(achar_ids(item, campos))
    return achados


def main():
    try:
        evento = json.load(sys.stdin)
    except ValueError:
        bloquear("evento ilegível")
    nome = evento.get("tool_name", "")
    entrada = evento.get("tool_input", {}) or {}
    acao = nome.split("__")[-1]

    if not ESCRITA.search(acao):
        sys.exit(0)

    allow = carregar_allowlist()

    if nome.startswith("mcp__Metricool"):
        blog = str(entrada.get("blogId", ""))
        if blog not in allow.get("metricool_blog_ids", {}):
            bloquear(f"marca {blog or '(sem blogId)'} não está ligada na allowlist do Metricool")
        sys.exit(0)

    if re.match(r"mcp__.*(meta|facebook)", nome, re.I):
        lista, tipo = allow.get("meta_ad_accounts", []), "conta de anúncios da Meta"
    elif re.match(r"mcp__.*google.?ads", nome, re.I):
        lista, tipo = allow.get("google_ads_customers", []), "conta do Google Ads"
    elif re.match(r"mcp__.*tiktok", nome, re.I):
        lista, tipo = allow.get("tiktok_advertisers", []), "conta do TikTok Ads"
    else:
        sys.exit(0)

    permitidas = {str(x).removeprefix("act_") for x in lista}
    ids = achar_ids(entrada, CAMPOS_CONTA_ADS)
    if not ids:
        bloquear(f"{tipo} não identificada na chamada {acao}")
    fora = [i for i in ids if i not in permitidas]
    if fora:
        bloquear(f"{tipo} {', '.join(fora)} fora da allowlist")
    sys.exit(0)


if __name__ == "__main__":
    main()
