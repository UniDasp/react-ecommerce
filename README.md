# LEVEL-UP GAMER — React E-commerce

Tienda online full-stack creada como proyecto práctico, con frontend en **React (Vite)** y backend en **Spring Boot**. Incluye autenticación con **JWT**, recuperación de contraseña (en desarrollo vía webhook de Discord), un flujo de pago simulado, manejo de stock atómico y un panel de administración básico.

---

## Contenido del repositorio

### Frontend (`src/`)

Aplicación React con las siguientes vistas principales:

* Home
* Products
* ProductDetail
* Cart
* Checkout
* Account
* AdminPanel

---

## Tecnologías utilizadas

### Frontend

* React 18
* Vite
* Context API

### Backend

*(Backend en un repositorio separado)*

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA / Hibernate
* MySQL o MariaDB

### Autenticación

* Tokens JWT de dos tipos:

  * `USER` → autenticación normal
  * `PAYMENT` → confirmar pagos


---

## Requisitos locales

* Java 17
* Maven
* Node.js + npm
* MySQL o MariaDB
* (Opcional) Laragon para un entorno más simple

---

## Configuración rápida (PowerShell)

### 1) Base de datos

Ten MySQL/Laragon funcionando y crea la base de datos si no existe.
Clona también el backend:

[https://github.com/PabloTerrazas16/ecommerce-backend](https://github.com/PabloTerrazas16/ecommerce-backend)

---

### 2) Configurar propiedades

Revisa y ajusta:

```
backend/ecommerce-backend/src/main/resources/application.properties
```

Configura:

* URL, usuario y contraseña de tu base de datos
* Webhook de Discord, ahi se envia el enlace de cambio de contraseña, normalmente uno usaria un servicio de correos pero... dev life 👨‍🦯 (estoy broke tio)

---

### 3) Iniciar el backend

```powershell
git clone https://github.com/PabloTerrazas16/ecommerce-backend
cd ecommerce-backend
```

Luego puedes levantarlo desde IntelliJ, NetBeans o cualquier IDE.

---

### 4) Iniciar el frontend

```powershell
cd "tu/ruta/react-ecommerce"
npm install
npm run dev
```

La aplicación inicia en:
`http://localhost:5173`

---

## Flujo de uso rápido

1. Regístrate e inicia sesión.
2. Agrega productos al carrito.
3. En Checkout, selecciona “Iniciar pago”.
4. El backend generará un `paymentId` y un `paymentToken`.
5. Ingresa una tarjeta simulada (16 dígitos) o directamente usa la otra opción, es mas rapida.
6. Con un usuario administrador, ve al panel de administrador, revisa el apartado de pedidos y marca tu pedido como completado, luego de eso revisa que el stock haya disminuido correctamente.

---

## Decisiones técnicas relevantes

* Uso de dos JWT: separa claramente la sesión del usuario del proceso de pago.
* Reducción de stock atómica con una query `@Modifying` para evitar overselling.
* Tokens de recuperación hashados y de un solo uso.
* `payment_token` se almacenó como `TEXT` para evitar errores de truncamiento.

---

## Panel de administración

Disponible en el frontend (`AdminPanel.jsx`).
Endpoint útil:

```
POST /pagos/{id}/confirmar-admin
```

Requiere rol `ADMIN`.

---

## Problemas comunes

**CORS:**
Revisar la configuración de `CorsConfig`.

**Tokens demasiado largos:**
Asegurarse de tener la versión del backend con `payment_token` en tipo `TEXT`.

**Permisos insuficientes:**
Algunos endpoints requieren `ROLE_ADMIN`. Crear un usuario admin desde la base de datos si es necesario.


---

## Contacto

* Discord: xdasp
* Email: [daspx@proton.me](mailto:daspx@proton.me)

