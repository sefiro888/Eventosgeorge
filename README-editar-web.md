# Como editar la web sin tocar HTML

Esta version incluye tres piezas nuevas:

- `contenido.json`: archivo con textos, telefono, email, WhatsApp, Instagram e imagenes principales.
- `contenido-loader.js`: aplica esos datos automaticamente sobre las paginas HTML.
- `editor.html`: pantalla sencilla para modificar `contenido.json`.
- `dev-server.js`: servidor local opcional para probar la web en este ordenador.

## Pasos para editar

1. Abre `editor.html` en el navegador. Puede abrirse directamente como archivo, sin servidor local.
2. Cambia los campos que quieras.
3. Para cambiar una foto, entra en la pagina correspondiente y usa el selector del campo `Foto principal`.
4. Pulsa `Descargar contenido.json`.
5. Sube ese archivo al repositorio sustituyendo el `contenido.json` anterior.
6. GitHub Pages publicara los cambios.

## Archivos que hay que subir a GitHub

Sube todo el contenido de esta carpeta al repositorio:

- `index.html`
- `bodas.html`
- `contacto.html`
- `decoracion.html`
- `sonido.html`
- `baby-shower.html`
- `contenido.json`
- `contenido-loader.js`
- `editor.html`
- `README-editar-web.md`
- `dev-server.js` si quieres conservar la prueba local

## Como usar fotos

Tienes dos opciones:

### Opcion facil

En `editor.html`, pulsa el selector de archivo del campo `Foto principal`, elige una imagen del ordenador y luego pulsa `Descargar contenido.json`.

La foto se guarda dentro de `contenido.json`. Es lo mas sencillo porque solo tienes que subir un archivo.

### Opcion mas ordenada

Sube fotos al repositorio, por ejemplo:

`imagenes/portada.jpg`

Luego escribe esa ruta en el campo `Foto principal`.

Esta opcion mantiene `contenido.json` mas pequeno.

## Importante sobre GitHub Pages

GitHub Pages no permite que una pagina guarde cambios directamente en el repositorio sin iniciar sesion ni usar una API.

Por eso el editor hace esto:

1. Te deja editar visualmente.
2. Pulsa `Descargar contenido.json`.
3. Subes ese `contenido.json` a GitHub.
4. La web publicada lee el nuevo archivo y cambia los textos/fotos.

En este ordenador tambien puedes abrirlo con esta ruta:

`C:\Users\sefir\Documents\GitHub\EVENTOSGEORGE\editor.html`

## Importante

Los HTML originales siguen funcionando. Este sistema esta preparado para editar primero lo mas habitual: datos de contacto, titulos principales, textos de cabecera e imagen principal de cada pagina.
