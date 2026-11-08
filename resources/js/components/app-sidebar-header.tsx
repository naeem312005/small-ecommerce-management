import { usePage } from '@inertiajs/react';
import { ArrowUpRight, Globe, Moon, Sun } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType, User } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const role = auth?.user?.role;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-background/95 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
            <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:bg-muted hover:text-foreground" />
                <div className="hidden h-4 w-px bg-border sm:block" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Live System Indicator */}
                <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/70 bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span>{role === 'admin' ? 'Admin Live' : 'Store Live'}</span>
                </div>

                {/* View Customer Storefront */}
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted shadow-2xs"
                    title="Open live public marketplace in a new tab"
                >
                    <Globe className="h-3.5 w-3.5 text-primary" />
                    <span className="hidden sm:inline">Storefront</span>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-70" />
                </a>

                {/* Theme Toggle (Light / Dark) */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-8 w-8 rounded-xl border border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground shadow-2xs"
                    title={`Switch to ${resolvedAppearance === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {resolvedAppearance === 'dark' ? (
                        <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0" />
                    ) : (
                        <Moon className="h-4 w-4 text-slate-700 transition-transform rotate-0" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    );
}
