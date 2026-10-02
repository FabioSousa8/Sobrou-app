# sobrou-proxy

Proxy serverless para a API Gemini do app **Sobrou?**

## Por que existe?
A chave da API Gemini fica APENAS aqui, no servidor. O app mobile nunca vê a chave.

## Deploy (5 minutos, grátis)

1. Instale a CLI do Vercel: `npm i -g vercel`
2. Entre nesta pasta: `cd proxy-gemini`
3. Faça login: `vercel login`
4. Configure a variável de ambiente com sua chave:
   ```
   vercel env add GEMINI_API_KEY
   ```
   (cole sua chave quando pedir)
5. Deploy: `vercel --prod`
6. Anote a URL que aparecer, ex: `https://sobrou-proxy.vercel.app`
7. Abra `src/Services/ia.ts` e troque o valor de `PROXY_URL` pela sua URL + `/api/gemini`

## Dev local
```bash
npm i -g vercel
vercel dev
# roda em http://localhost:3000/api/gemini
```
