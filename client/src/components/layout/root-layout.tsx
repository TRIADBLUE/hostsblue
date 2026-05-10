import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer } from './cart-drawer';
import { useCart } from '@/hooks/use-cart';

export function RootLayout() {
  const cart = useCart();
  const { pathname } = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header cartItemCount={cart.itemCount} onCartClick={cart.openCart} />
      <main className="flex-1">
        <Outlet context={cart} />
      </main>
      <Footer />
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={cart.closeCart}
        items={cart.items}
        subtotal={cart.subtotal}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
      />
    </div>
  );
}
