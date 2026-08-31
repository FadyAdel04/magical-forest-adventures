import { useStore } from "@/hooks/useStore";
import { Plus, Minus } from "lucide-react";
import { getPixelProductParams, trackAddToCart } from "@/lib/meta-pixel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { EnNum } from "@/components/shared/EnNum";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { catalog, cart, removeFromCart, updateCartQuantity, clearCart } = useStore();

  if (!catalog.active) return null;

  const cartItem = cart?.items?.find((item) => item.productId === catalog.id);
  const quantity = cartItem?.quantity || 0;

  const handleOrderNow = () => {
    // Scroll to order section
    const orderSection = document.getElementById("order");
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth" });
    }
    // Close drawer
    onClose();
  };

  // Calculate totals from entire cart (not just this item)
  const subtotal = cart?.items?.reduce((total, item) => total + item.quantity * item.unitPrice, 0) || 0;
  const shippingFee = 0; // TODO: Implement proper shipping calculation based on location
  const total = subtotal + shippingFee;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[360px] sm:w-[400px] flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>عربة التسوق</SheetTitle>
          <SheetDescription>
            {cart?.items?.length > 0 ?
              `لديك ${cart.items.reduce((total, item) => total + item.quantity, 0)} منتج في سلتك` :
              "سلتك فارغة"
            }
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
          {cart?.items?.length > 0 ? (
            <>
              {/* Cart Items */}
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {/* Product Image */}
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="flex-shrink-0 h-20 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex-shrink-0 h-20 w-20 rounded-lg bg-muted-foreground/20">
                            {/* Placeholder for image */}
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-forest-deep">{item.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.title}
                          </p>
                          {/* Quantity controls moved here - under title and description */}
                          <div className="flex items-center gap-3 rounded-full border border-border/60 bg-white/50 p-1 w-fit">
                            <button
                              type="button"
                              onClick={() => {
                                const newQty = item.quantity - 1;
                                updateCartQuantity(item.productId, newQty);
                                const params = getPixelProductParams(catalog, newQty);
                                if (params) trackAddToCart(params);
                              }}
                              disabled={item.quantity <= 1}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-forest-deep shadow-sm transition-colors hover:bg-forest/10 disabled:opacity-50 disabled:hover:bg-white"
                              aria-label="تقليل الكمية"
                            >
                              <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm font-bold text-forest-deep font-mono">
                              <EnNum>{formatNumber(item.quantity)}</EnNum>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newQty = item.quantity + 1;
                                updateCartQuantity(item.productId, newQty);
                                const params = getPixelProductParams(catalog, newQty);
                                if (params) trackAddToCart(params);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-white shadow-sm transition-colors hover:bg-forest-deep"
                              aria-label="زيادة الكمية"
                            >
                              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Price Summary */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>السعر الفرعي</span>
                      <span>
                        <EnNum>{formatNumber(subtotal)}</EnNum> {catalog.currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>الشحن</span>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                        يُحسب عند اختيار المحافظة
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-forest-deep pt-2 border-t border-border/50">
                      <span>الإجمالي <span className="text-[10px] font-normal text-muted-foreground">(غير شامل الشحن)</span></span>
                      <span className="text-base">
                        <EnNum>{formatNumber(total)}</EnNum> {catalog.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد منتجات في سلتك</p>
                <p className="text-sm">أضف منتجات إلى السلة لمتابعة الشراء</p>
              </div>
            )}
        </div>

        <SheetFooter className="mt-auto pt-4 border-t border-border">
          {cart?.items?.length > 0 ? (
            <div className="w-full flex flex-col gap-2">
              <Button
                onClick={handleOrderNow}
                className="w-full bg-gradient-forest text-cream hover:scale-[1.02]"
              >
                تابع للطلب الآن
              </Button>
              <Button
                onClick={() => {
                  clearCart();
                  onClose();
                }}
                className="w-full bg-background border border-border text-muted-foreground hover:bg-muted-foreground/5"
              >
                مسح السلة
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <Button
                onClick={onClose}
                className="w-full bg-background border border-border text-muted-foreground hover:bg-muted-foreground/5"
              >
                متابعة التسوق
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}