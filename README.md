# ArchFlow

Herramienta de gestión de proyectos para estudios de arquitectura. Permite hacer seguimiento de proyectos, presupuestos, hitos, equipo, documentación y actividad — con un portal de acceso para clientes.

**Producción:** [archflow-kks5.vercel.app](https://archflow-kks5.vercel.app)

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma v5** + **PostgreSQL** (Neon)
- **Recharts** — gráficos de presupuesto
- **Leaflet** — mapa de proyectos
- **JWT** (`jose`) + **bcryptjs** — autenticación

## Funcionalidades

- Dashboard con estadísticas y gráficos
- Gestión completa de proyectos (presupuesto, hitos, gastos, equipo, documentos, galería)
- Calendario de hitos
- Mapa interactivo de proyectos en Granada
- Informes PDF por proyecto
- Portal de cliente con vista de su proyecto
- Roles: `admin`, `client`, `normal`

## Arrancar en local

```bash
npm install
```

Crea un archivo `.env` con:

```
DATABASE_URL="postgresql://..."
JWT_SECRET="tu-secreto"
```

```bash
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Usuarios de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@archflow.es | Admin1234! | Admin |
| jmorales@gmail.com | Cliente1234! | Cliente |
