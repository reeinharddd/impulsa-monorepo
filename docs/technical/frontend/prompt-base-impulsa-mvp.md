
PROMPT BASE — IMPULSA MVP (Angular 21) — ACTUALIZACIÓN 2025-12-26

Usa este prompt tal cual para generar el proyecto inicial, scaffolding o asistencia de IA. Sigue estrictamente las prácticas y documentación del repositorio (docs/process/* y docs/templates/*). Cumple las reglas legales y de producto indicadas abajo.

CONTEXTO DEL PRODUCTO
- Producto: Impulsa — cobros presenciales sin custodiar dinero; rail principal: transferencias bancarias (SPEI / CoDi).
- NO custodia fondos, NO procesa pagos; facilita generación, presentación y confirmación de cobros entre banco a banco.
- Público objetivo: comercios pequeños (inventario básico) y personas (cobros puntuales).
- Registro define tipo de usuario: "business" o "person" y condiciona la UI.

STACK OBLIGATORIO Y NORMAS REPOSITORY
- Angular 21, TypeScript estricto.
- Arquitectura modular (lazy-loaded feature modules), routing explícito.
- Runtime: Bun (seguir package.json y scripts del repo).
- State: Signals / @ngrx/signals (evitar RxJS excesivo).
- Seguir documentación del repo: usar templates en templates para cualquier documentación nueva, actualizar frontmatter y Change Log (Appendix A) al crear docs.
- Convenciones de commit: Conventional Commits (ver docs/process/standards/TOOLING-STYLE-GUIDE.md).

PRINCIPIOS DE PRODUCTO (mandatorios)
- Desktop-first: Landing pública visible solo en desktop (no en mobile).
- Mobile: acceso directo a login; redirigir a `/auth` en bootstrap si DeviceService detecta móvil.
- UX legal copy obligatorio: mostrar “Impulsa no custodia fondos” y “El tiempo de confirmación depende del banco emisor”. Nunca mostrar “dinero acreditado” ni prometer instantaneidad.
- No incluir facturación electrónica, roles avanzados, wallets internas, integraciones adquirentes, ni manejo de personal en el MVP.

TIPOS DE USUARIO
- Business: gestionar inventario mínimo, crear ventas seleccionando productos, cobrar total.
- Person: sin inventario, generar cobros manuales por monto.

SECCIONES OBLIGATORIAS (routing + componentes)
- Landing (desktop only): qué es, para quién, problema que resuelve, CTA Registrarse / Acceder.
- Auth: Login y Registro (registro define tipo de usuario).
- Home post-login:
  - Business: Nueva venta, Inventario, Última venta.
  - Person: Generar cobro, Historial.
- Inventario (business): Crear/Editar producto, ajustar stock, activar/desactivar. Campos: nombre, precio, stock, estado.
- Nueva Venta (business): seleccionar productos → mostrar lista → calcular total automáticamente → Acción: Cobrar (crea Sale + PaymentIntent).
- Generar Cobro (person): ingresar monto, nota opcional → generar PaymentIntent.
- Cobro Activo (pantalla crítica): mostrar monto, estado, canales (QR, Link, NFC_PRESENTATION, PROXIMITY_SHARE), referencia, fecha/hora, acciones (invalidar, marcar pago enviado en modo mock).
- Confirmación: recibo no fiscal con fecha/hora, referencia, volver a nueva venta/nuevo cobro.
- Historial: lista cronológica simple (monto, estado, fecha).

MODELO DE DATOS MÍNIMO (nombres sugeridos de archivos)
- `core/models/enums.ts`
  - ChargeStatus: CREATED, PRESENTED, PAYMENT_SENT, CONFIRMED, FAILED, EXPIRED, CANCELED, ABANDONED
  - ChannelType: QR, LINK, NFC_PRESENTATION, PROXIMITY_SHARE
- `core/models/user.model.ts` — User {id,name,email?,type:'business'|'person'}
- `core/models/product.model.ts` — Product {id,name,priceCents,stock,active}
- `core/models/sale.model.ts` — Sale {id,items,totalCents,createdAt,reference,confirmed}
- `core/models/payment-intent.model.ts` — PaymentIntent {id,amountCents,status,channels,reference,createdAt,note?,saleId?}

REGLAS CLAVE DE DOMINIO (must implement & document)
1. Orquestación vs persistencia
   - PaymentStateService: ORQUESTADOR. Debe:
     - Validar transiciones (permitidas).
     - Emitir eventos validados (señales/observables).
     - Ser idempotente (ignorar transiciones redundantes).
     - NO persistir PaymentIntent ni actuar como fuente de verdad.
   - MockApiService (o backend real): REPOSITORIO. Debe:
     - Persistir PaymentIntent, usuarios, productos y ventas (localStorage en MVP).
     - Escuchar eventos validados del PaymentStateService y aplicar cambios de estado a la persistencia.
     - Devolver snapshots (fuente de verdad para la UI).
   - Beneficio: facilita migración a backend real sin reescribir orquestación.

2. Estados y transiciones
   - Estados: CREATED → PRESENTED → PAYMENT_SENT → CONFIRMED | FAILED | EXPIRED | CANCELED
   - Estado adicional: ABANDONED (huérfano). MVP: documentar y mapear internamente a EXPIRED para persistencia si aplica (pero permitir que el orquestador valide/emet a ABANDONED y el repositorio lo traduzca si la política lo requiere).
   - Validación estricta de transiciones en PaymentStateService; registrar/rechazar transiciones inválidas.

3. Canales y naming (semántica importante)
   - NO usar “NFC Payment” en código o UI.
   - Usar ChannelType.NFC_PRESENTATION y ChannelType.PROXIMITY_SHARE.
   - En UI mostrar etiquetas descriptivas (ej. “Compartir por proximidad”) pero código y documentación deben usar los nombres semánticos anteriores para evitar malentendidos legales/funcionales.

4. Cobro y canales
   - Todos los canales representan el mismo PaymentIntent.
   - Si un canal confirma el pago, el orquestador debe emitir CONFIRMED para el PaymentIntent y el repositorio debe invalidar/actualizar los otros canales.
   - La UI debe reaccionar a cambios del mismo PaymentIntent (sin duplicados).

5. Stock y ventas
   - Regla MVP: descontar stock SOLO cuando el pago esté en estado CONFIRMED.
   - No implementar reservas en MVP. Documentar la decisión claramente.
   - Si en futuro se añade reserva, implementar como fase separada (reserva con expiración y liberación).

IMPLEMENTACIÓN TÉCNICA RECOMENDADA (stubs / archivos)
- `core/services/payment-state.service.ts`
  - Métodos: validateAndEmit(intent, to, meta?), timeout/expire helper, exposa validatedTransition$ (Observable/Signal).
  - No persistencia; mapeo ABANDONED→EXPIRED documentado si se desea.
  - Definir allowedTransitions en un mapa.
- `core/services/mock-api.service.ts`
  - Persistencia en localStorage (keys versionadas).
  - Métodos: registerUser, createProduct, updateProduct, listProducts, createSale, getSale, createPaymentIntent, getPaymentIntent, listPaymentIntents, updatePaymentIntentStatus.
  - Subscribirse a PaymentStateService.validatedTransition$ y aplicar actualización persistente; en CONFIRMED -> aplicar decrecimiento de stock y marcar sale.confirmed.
  - IDs determinísticos (ej. prefijos `u_`,`p_`,`s_`,`pi_`) y referencias legibles para receipt.
- `core/services/device.service.ts`
  - Detectar tipo (mobile/desktop) UNA VEZ en bootstrap para evitar bucles; exponer isMobile readonly.
- Guards & routing
  - `auth.guard.ts` protege `/app/*`.
  - app.routes.ts:
    - '' -> LandingModule (si DeviceService.isMobile redirigir a /auth).
    - 'auth' -> AuthModule
    - 'app' -> AppShellModule (canActivate: AuthGuard; children depend on user.type).
- Shared components
  - `shared/header`, `shared/receipt`, `shared/payment-channels` (muestran canales y acciones).
- Tests
  - Unit tests para PaymentStateService (transiciones válidas/invalidas, idempotencia) y MockApiService (persistencia, decremento stock en CONFIRMED).
  - Usar Vitest or @angular/build test config already in repo.

UX / COMPORTAMIENTO (detallado)
- Landing: visible solo en desktop.
- Auth: Login/Registro con validaciones (TypeScript zod opt optional).
- Home:
  - Business: botón Nueva venta, acceso Inventario, tarjeta Última venta.
  - Person: botón Generar cobro, Historial simple.
- Nueva Venta: seleccionar productos (cantidad, ver stock), sumar total, acción Cobrar crea Sale + PaymentIntent (status CREATED → PRESENTED).
- Generar Cobro (persona): monto, nota → crea PaymentIntent.
- Cobro Activo:
  - Mostrar: monto, estado, referencia, fecha/hora, canales disponibles (QR, Link, NFC_PRESENTATION, PROXIMITY_SHARE).
  - Acción Mock: “Marcar pago enviado” que emite PAYMENT_SENT → orquestador valida → repositorio persistirá según subscription.
  - Timer de expiración configurable; ABANDONED detectado por cerrar/huir del flujo puede documentarse y mapearse a EXPIRED.
- Confirmación: recibo no fiscal (fecha/hora/referencia), botones: Nueva venta / Nuevo cobro.
- Mensajes legales visibles en pantallas de cobro.

DOCUMENTACIÓN (obligatorio)
- Guardar este PROMPT BASE en `docs/technical/frontend/prompt-base-impulsa-mvp.md` usando plantilla `00-GENERAL-DOC-TEMPLATE.md` o `01-FEATURE-DESIGN-TEMPLATE.md` según corresponda.
- Añadir decisión sobre ABANDONED mapping, stock-only-on-confirmed, naming NFC en la sección de decisiones (Appendix A Change Log).
- Actualizar frontmatter `last_updated` y versión semántica.

LÍMITES DEL MVP (recordatorio)
- NO integrar gateways de pago reales.
- NO wallets, NO CFDI, NO roles avanzados.
- No prometer acreditación instantánea.
- No manipular dinero; mostrar copy legal.

OBJETIVO DEL CÓDIGO
- Mockups funcionales con flujos operativos que permiten navegación completa y pruebas de UX/estados.
- Componentes reutilizables, código claro y extensible.
- Evitar deuda técnica: separar orquestador (PaymentStateService) de repositorio (MockApiService).

ENTREGABLES MÍNIMOS
- Scaffolding Angular con módulos lazy-loaded: landing, auth, app-shell, business (inventory, sales), person (charge, history), shared, core.
- Modelos en `core/models/*`.
- `PaymentStateService` (orquestador) y `MockApiService` (persistente localStorage).
- `DeviceService` que detecta dispositivo UNA VEZ.
- Guard y routing con redirección mobile→/auth.
- Pantallas/Componentes stub para Cobro Activo, Nueva Venta, Inventario, Auth, Landing.
- Tests unitarios básicos para PaymentStateService y MockApiService.
- Documentación en docs usando templates del repo y CHANGELOG actualizado.
- README con pasos mínimos (instalación con Bun y comandos de run/build).

NOTAS FINALES (disciplinas)
- Nombrado semántico: usar `NFC_PRESENTATION` y `PROXIMITY_SHARE` en código y documentación.
- PaymentStateService: NO persistir intents.
- MockApiService: ser la fuente de verdad en MVP.
- Stock: descontar solo en CONFIRMED — documentado.
- ABANDONED: documentar y mapear a EXPIRED en persistencia si la política lo requiere.
- Seguir AI-DEVELOPMENT-STANDARD.md y `docs/templates/*` antes de crear docs o ADRs.
