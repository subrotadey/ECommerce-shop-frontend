import CartProvider from "../contexts/CartProvider";

export default function AppProviders({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}   
