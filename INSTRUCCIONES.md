# SPARRING — Cómo ponerlo online en 10 minutos

Todo gratis. Sin tarjeta de crédito. Son 3 pasos.

---

## PASO 1: Consigue tu API key de Gemini (2 min)

1. Ve a **aistudio.google.com**
2. Inicia sesión con tu cuenta de Google (cualquiera sirve)
3. Haz clic en **"Get API Key"** (está arriba a la izquierda)
4. Clic en **"Create API Key"**
5. Copia la key que te da (es un texto largo que empieza con "AIza...")
6. Guárdala en algún lugar seguro (notas, un doc, lo que sea)

Listo. Ya tienes la key.

---

## PASO 2: Sube el proyecto a GitHub (3 min)

1. Ve a **github.com** e inicia sesión (si no tienes cuenta, créala gratis)
2. Clic en el **"+"** arriba a la derecha → **"New repository"**
3. Nombre: **sparring** (o lo que quieras)
4. Marca **"Private"** si quieres que sea solo tuyo
5. Clic en **"Create repository"**
6. En la página que aparece, busca el link que dice **"uploading an existing file"** y haz clic
7. Descomprime el ZIP que descargaste de Claude (SPARRING_Proyecto_Vercel.zip)
8. Arrastra TODOS los archivos de la carpeta **sparring-app/** a la página de GitHub
   - Asegúrate de arrastrar el CONTENIDO de la carpeta, no la carpeta misma
   - Deberías ver: app/, public/, package.json, next.config.js, .env.example
9. Clic en **"Commit changes"**

Listo. Tu código está en GitHub.

---

## PASO 3: Despliega en Vercel (5 min)

1. Ve a **vercel.com** y clic en **"Start Deploying"**
2. Inicia sesión con tu cuenta de GitHub
3. Te va a pedir permiso para acceder a tus repos. Acepta.
4. Busca tu repo **"sparring"** y haz clic en **"Import"**
5. En la pantalla de configuración:
   - Framework: debería detectar **Next.js** automáticamente
   - Busca la sección **"Environment Variables"**
   - Agrega una variable:
     - **Name:** `GEMINI_API_KEY`
     - **Value:** (pega aquí la API key del Paso 1)
   - Clic en **"Add"**
6. Clic en **"Deploy"**
7. Espera 1-2 minutos. Vercel construye tu app.
8. Cuando termine, te da un link tipo **sparring-xxxxx.vercel.app**

Ese es tu link. Compártelo con quien quieras. No necesitan cuenta de nada.

---

## DESPUÉS

- Para cambiar algo, edita los archivos en GitHub y Vercel lo re-deploya automáticamente
- Si quieres un dominio personalizado (ej: sparring.tuempresa.com), lo configuras gratis en Vercel → Settings → Domains
- Si el free tier de Gemini se agota (muy improbable), Vercel te avisará con errores. Puedes esperar al día siguiente o subir a un plan pagado de Gemini ($0.10 por millón de tokens)

---

## NOTA SOBRE ARCHIVOS

La versión web solo acepta archivos de texto (.txt, .md, .csv) porque Gemini free no soporta documentos binarios como PDF/DOCX de la misma forma que Claude. Para evaluar decks o documentos Word, copia y pega el texto relevante en el campo de texto.

---

## SI ALGO FALLA

- **"API key not configured"** → revisa que la variable GEMINI_API_KEY está bien puesta en Vercel (Settings → Environment Variables)
- **"Gemini API error"** → tu key puede estar mal copiada, vuelve a aistudio.google.com y genera una nueva
- **La página no carga** → revisa en Vercel → Deployments que el build haya sido exitoso
- **Para cualquier duda** → pégame el error acá y lo resolvemos

