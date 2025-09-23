"use client";

import { useState } from "react";
import {
  Home as HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import Cart from "./cart";
import CategoryListMenu from "./category-list-menu";

export const Header = ({ categories }: { categories: any[] }) => {
  const { data: session } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    setMenuOpen(false); // fecha o menu
    router.push(href); // navega
  };

  return (
    <header className="flex items-center justify-between p-5">
      <Image
        src="/logo.svg"
        alt="BEWEAR"
        width={100}
        height={26.14}
        className="cursor-pointer"
        onClick={() => handleNavigate("/")}
      />

      <div className="flex items-center gap-2">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <>
                  <div className="flex justify-between space-y-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOutIcon />
                    </Button>
                  </div>

                  <hr />

                  <div className="flex flex-col gap-2 p-1 font-semibold">
                    <button
                      onClick={() => handleNavigate("/")}
                      className="flex w-full items-center gap-2 text-left hover:text-blue-600"
                    >
                      <HomeIcon className="h-5 w-5" />
                      <span>Início</span>
                    </button>

                    <button
                      onClick={() => handleNavigate("/my-orders")}
                      className="flex w-full items-center gap-2 text-left hover:text-blue-600"
                    >
                      <Package className="h-5 w-5" />
                      <span>Meus Pedidos</span>
                    </button>

                    <button
                      onClick={() => handleNavigate("/cart/identification")}
                      className="flex w-full items-center gap-2 text-left hover:text-blue-600"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Sacola</span>
                    </button>
                  </div>

                  <hr />

                  <div className="px-5">
                    <CategoryListMenu
                      categories={categories.map((cat: any) => ({
                        ...cat,
                        onClick: () => handleNavigate(`/category/${cat.slug}`),
                      }))}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleNavigate("/authentication")}
                  >
                    <LogInIcon />
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Cart />
      </div>
    </header>
  );
};
