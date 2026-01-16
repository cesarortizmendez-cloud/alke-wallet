Este es un proyecto de wallet
requerido como evaluación de la unidad 2
Alumno: César Ortiz Mendez

Proyecto módulo 2 (Fundamentos Front-end).  
Incluye: Login, saldo, depósitos/retiros, transferencias simuladas, contactos y historial de transacciones.

## Stack
- HTML / CSS / JavaScript
- Bootstrap 5
- jQuery
- Persistencia simulada con localStorage (almacenamiento local)

## Cómo ejecutar
1. Abrir con VS Code
2. Usar extensión Live Server sobre `index.html`

## Credenciales demo
- Email: demo@alkewallet.com
- Password: Alke1234





 
## Descripción de pages/menu.html

- Propósito: página principal de la aplicación después del login; muestra el saldo
	disponible y accesos rápidos a las funcionalidades principales.
- Localización: `pages/menu.html` (archivo HTML de la vista principal).
- Elementos importantes:
	- `data-page="menu"`: atributo en el `<body>` que permite a los scripts
		detectar la vista activa y ejecutar solo la lógica necesaria.
	- `#balanceValue`: elemento donde se muestra el saldo actual; es actualizado
		dinámicamente por `wallet.js`.
	- Barra de navegación: enlaces a `deposit.html`, `sendmoney.html` y
		`transactions.html`, y botón `Salir` que gestiona el logout vía `auth.js`.
- Orden de scripts: los ficheros en `assets/js` se cargan al final de la página
	en este orden recomendado: `data.js`, `ui.js`, `auth.js`, `wallet.js`, `app.js`.
	Esto asegura que los datos y helpers estén disponibles antes de la lógica de
	sesión y wallet.

## Descripción de pages/login.html

- Propósito: vista de autenticación que permite al usuario iniciar sesión en la
	aplicación. Muestra credenciales demo para pruebas.
- Localización: `pages/login.html`.
- Elementos importantes:
	- `data-page="login"`: atributo en el `<body>` usado por `app.js` para ejecutar
		la inicialización específica de la vista.
	- `#loginForm`: formulario de login; `auth.js` escucha su evento `submit` para
		validar credenciales y redirigir al menú en caso de éxito.
	- `#email` y `#password`: inputs con validación HTML5 (`type="email"`,
		`required`, `minlength`) que facilitan una validación básica antes del envío.
- Orden de scripts: los ficheros en `assets/js` se cargan al final de la página
	(ej.: `data.js`, `ui.js`, `auth.js`, `wallet.js`, `app.js`). `auth.js` es el
	responsable principal de la lógica de login y depende de utilidades de `ui.js`.

## Descripción de index.html

- Propósito: página de entrada (landing) del proyecto; suele ser el primer punto
	que ve el usuario y enlaza a la vista de login y a recursos públicos.
- Localización: `index.html` (archivo raíz del proyecto).
- Elementos importantes:
	- Navegación / enlaces: acceso directo a `pages/login.html` y otras vistas.
	- Bloque visual principal: contiene la introducción breve del proyecto y
		botones que dirigen al flujo de autenticación o a la documentación.
	- Recursos estáticos: carga de CSS (`assets/css/styles.css`) y librerías CDN
		(Bootstrap, jQuery) necesarias para la apariencia y comportamiento.
- Scripts: al cargar `index.html` se incluyen los mismos ficheros JS de la app
	(`assets/js/*.js`) en el orden recomendado para garantizar que utilidades y
	datos estén disponibles antes de la inicialización en `app.js`.


