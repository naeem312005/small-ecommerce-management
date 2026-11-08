import { Link, usePage } from '@inertiajs/react';
import {
    ExternalLink,
    Globe,
    Layers,
    LayoutGrid,
    Package,
    PackageCheck,
    PackagePlus,
    Shield,
    Store,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import type { NavItem, User } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth?.user;
    const role = user?.role;
    const firstShop = user?.shops?.[0];

    const adminNavItems: NavItem[] = [
        {
            title: 'Overview',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Merchant Shops',
            href: '/admin/shops',
            icon: Store,
        },
        {
            title: 'Master Catalog',
            href: '/admin/products',
            icon: Package,
        },
        {
            title: 'Merchant Accounts',
            href: '/admin/shop-owners',
            icon: Users,
        },
    ];

    const shopOwnerNavItems: NavItem[] = [
        {
            title: 'Shop Dashboard',
            href: '/shop-owner/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Storefront Inventory',
            href: '/shop-owner/products',
            icon: PackageCheck,
        },
        {
            title: 'Shared Catalog',
            href: '/shop-owner/catalog',
            icon: Layers,
        },
        {
            title: 'Contribute Product',
            href: '/shop-owner/catalog/create',
            icon: PackagePlus,
        },
    ];

    const footerNavItems: NavItem[] = [
        ...(role === 'shop_owner' && firstShop
            ? [
                  {
                      title: `Visit ${firstShop.name}`,
                      href: `/shops/${firstShop.slug}`,
                      icon: ExternalLink,
                  },
              ]
            : []),
        {
            title: 'Customer Storefront',
            href: '/',
            icon: Globe,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {role === 'admin' && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <Shield className="h-3.5 w-3.5 text-primary" />
                            Administrator
                        </SidebarGroupLabel>
                        <NavMain items={adminNavItems} />
                    </SidebarGroup>
                )}

                {role === 'shop_owner' && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <Store className="h-3.5 w-3.5 text-primary" />
                            Shop Management
                        </SidebarGroupLabel>
                        <NavMain items={shopOwnerNavItems} />
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
