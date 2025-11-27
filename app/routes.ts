import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout('components/layouts/MainLayout.tsx', [
        index('routes/home.tsx'),
        route('login', 'routes/login.tsx'),
        route('register', 'routes/register.tsx'),
        route('database', 'routes/database.tsx'),
        route('contact', 'routes/contact.tsx'),
        route('messages', 'routes/messages.tsx'),
        route('chart', 'routes/chart.tsx'),
        route('crud', 'routes/crud.tsx'),
        route('admin', 'routes/admin.tsx'),
    ]),
    // API routes
    route('api/auth/register', 'routes/api/auth/register.ts'),
    route('api/auth/login', 'routes/api/auth/login.ts'),
    route('api/auth/logout', 'routes/api/auth/logout.ts'),
    route('api/auth/me', 'routes/api/auth/me.ts'),
] satisfies RouteConfig;
