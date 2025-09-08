import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../button";
import { ShoppingBasketIcon } from "lucide-react";

export const Cart = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <ShoppingBasketIcon />
          </Button>
        </SheetTrigger>
        <SheetContent></SheetContent>
      </Sheet>
    </>
  );
};

export default Cart;
