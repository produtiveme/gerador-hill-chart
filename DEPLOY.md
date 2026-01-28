# Deploy no GitHub Pages - Guia Completo

## ✅ Configurações Aplicadas

As seguintes configurações foram adicionadas para funcionar no GitHub Pages:

1. **`vite.config.ts`** - Configurado `base: '/gerador-hill-chart/'`
2. **`App.tsx`** - Adicionado `basename="/gerador-hill-chart"` no BrowserRouter
3. **`.github/workflows/deploy.yml`** - Workflow automático de deploy
4. **`public/404.html`** - Suporte para rotas do React Router

## 📝 Passos para Deploy

### 1. Commit e Push das Mudanças

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### 2. Ativar GitHub Pages no Repositório

1. Vá em **Settings** do repositório no GitHub
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione:
   - **Source**: GitHub Actions *(opção recomendada)*
   
4. Salve as configurações

### 3. Aguardar o Deploy

- O GitHub Actions vai rodar automaticamente após o push
- Acompanhe em: `https://github.com/produtiveme/gerador-hill-chart/actions`
- Aguarde o workflow terminar (✅ verde = sucesso)

### 4. Acessar o Site

Após deploy bem-sucedido, acesse:
```
https://produtiveme.github.io/gerador-hill-chart/
```

## 🔧 Solução de Problemas

### Problema: Página em branco ou 404

**Solução 1**: Verificar se GitHub Pages está configurado
- Settings → Pages → Source deve estar como "GitHub Actions"

**Solução 2**: Verificar se o workflow rodou
- Actions → Verificar se há um workflow verde
- Se vermelho, clicar e ver os logs de erro

**Solução 3**: Limpar cache do navegador
- Ctrl+Shift+R (ou Cmd+Shift+R no Mac)

### Problema: CSS não carrega

**Causa**: Base path incorreto

**Solução**: Verificar se `vite.config.ts` tem:
```ts
base: '/gerador-hill-chart/',
```

### Problema: Rotas não funcionam

**Causa**: React Router precisa do basename

**Solução**: Verificar se `App.tsx` tem:
```tsx
<BrowserRouter basename="/gerador-hill-chart">
```

## 🚀 Deploy Manual (Alternativa)

Se o GitHub Actions não funcionar, pode fazer deploy manual:

```bash
# 1. Build do projeto
npm run build

# 2. Navegar para a pasta dist
cd dist

# 3. Criar repositório git na pasta dist
git init
git add -A
git commit -m 'Deploy'

# 4. Push para branch gh-pages
git push -f https://github.com/produtiveme/gerador-hill-chart.git main:gh-pages

# 5. Voltar para raiz
cd ..
```

Depois, vá em Settings → Pages e selecione:
- **Source**: Deploy from a branch
- **Branch**: gh-pages / (root)

## 📌 Notas Importantes

- Sempre que fizer mudanças, o deploy é automático ao dar push na branch `main`
- O site pode demorar alguns minutos para atualizar após o deploy
- Certifique-se que o repositório é público (ou tenha GitHub Pro para Pages privado)
