import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearcart,
  selectCartItems,
  selectKitchenId,
} from "../../redux/slices/cartSlice";
import { placeOrder } from "../../redux/slices/orderSlice";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../redux/slices/orderSlice";
import UserDashboardNavbar from "./UserDashboardNavbar";
import CartSummary from "./CartSummary";

const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartPage({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const kitchenId = useSelector(selectKitchenId);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phoneNumber: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setDeliveryAddress((current) => ({ ...current, [name]: value }));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setCheckoutError(null);
    setCheckoutMessage(null);
    setIsProcessing(true);

    try {
      const orderDetails = {
        kitchenId,
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        deliveryAddress,
      };

      if (paymentMethod === "cash_on_delivery") {
        await dispatch(placeOrder({ ...orderDetails, paymentMethod })).unwrap();
        dispatch(clearcart());
        setCheckoutMessage("cod");
        setIsProcessing(false);
        return;
      }

      if (!(await loadRazorpay())) {
        throw new Error("Unable to load Razorpay checkout. Please try again.");
      }

      const paymentOrder = await dispatch(
        createRazorpayOrder(orderDetails),
      ).unwrap();
      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Cloud Kitchen",
        description: "Online order payment",
        order_id: paymentOrder.razorpayOrderId,
        prefill: { contact: deliveryAddress.phoneNumber },
        handler: async (payment) => {
          try {
            await dispatch(
              verifyRazorpayPayment({
                checkoutToken: paymentOrder.checkoutToken,
                razorpayOrderId: payment.razorpay_order_id,
                razorpayPaymentId: payment.razorpay_payment_id,
                razorpaySignature: payment.razorpay_signature,
              }),
            ).unwrap();
            dispatch(clearcart());
            setCheckoutMessage("online");
          } catch (error) {
            setCheckoutError(
              typeof error === "string" ? error : error.message || "Payment verification failed.",
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
        theme: { color: "#1c8b5b" },
      });
      checkout.on("payment.failed", (response) => {
        setCheckoutError(
          response.error.description || "Payment failed. Please try again.",
        );
        setIsProcessing(false);
      });
      checkout.open();
    } catch (error) {
      setCheckoutError(
        typeof error === "string"
          ? error
          : error.message || "Unable to place order.",
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-shell dashboard-page">
      <UserDashboardNavbar
        user={{ username: "Roshanara", email: "roshanara@gmail.com", role: "user" }}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <div className="dashboard-shell container">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__header">
            <div className="brand-mark">MK</div>
            <div>
              <p className="mini-label dark">Explore</p>
              <h3>User Space</h3>
            </div>
          </div>

          <nav className="dashboard-sidebar__nav" aria-label="User dashboard navigation">
            <Link to="/dashboard" className="dashboard-link">Overview</Link>
            <Link to="/dashboard/kitchens" className="dashboard-link">Kitchens</Link>
            <Link
              to="/dashboard/cart"
              className="dashboard-link dashboard-link--active"
              aria-current="page"
            >
              Cart
            </Link>
            <Link to="/dashboard/orders" className="dashboard-link">Orders</Link>
          </nav>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-hero">
            <div>
              <p className="mini-label dark">Cart</p>
              <h1>Your selected items</h1>
              <p className="dashboard-subtitle">
                Review quantities and total before checkout.
              </p>
              <Link to="/dashboard/kitchens" className="text-link">
                Continue browsing kitchens
              </Link>
            </div>
          </section>

          <div className="cart-checkout-grid">
            <CartSummary items={cartItems} />

            <article className="dashboard-panel dashboard-panel--wide">
            <div className="dashboard-panel__header">
              <div>
                <p className="mini-label dark">Delivery</p>
                <h3>Delivery address</h3>
              </div>
            </div>

            <form onSubmit={handleCheckout}>
              <label className="field-group">
                Street address
                <input
                  name="street"
                  value={deliveryAddress.street}
                  onChange={handleAddressChange}
                  autoComplete="street-address"
                  required
                />
              </label>

              <div className="inline-grid">
                <label className="field-group">
                  City
                  <input
                    name="city"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    autoComplete="address-level2"
                    required
                  />
                </label>
                <label className="field-group">
                  State
                  <input
                    name="state"
                    value={deliveryAddress.state}
                    onChange={handleAddressChange}
                    autoComplete="address-level1"
                    required
                  />
                </label>
                <label className="field-group">
                  Postal code
                  <input
                    name="zipCode"
                    value={deliveryAddress.zipCode}
                    onChange={handleAddressChange}
                    autoComplete="postal-code"
                    required
                  />
                </label>
                <label className="field-group">
                  Country
                  <input
                    name="country"
                    value={deliveryAddress.country}
                    onChange={handleAddressChange}
                    autoComplete="country-name"
                    required
                  />
                </label>
              </div>

              <label className="field-group">
                Phone number
                <input
                  name="phoneNumber"
                  type="tel"
                  value={deliveryAddress.phoneNumber}
                  onChange={handleAddressChange}
                  autoComplete="tel"
                  required
                />
              </label>

              <fieldset className="payment-options">
                <legend>Payment method</legend>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={() => setPaymentMethod("cash_on_delivery")}
                  />
                  Cash on delivery
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  Online payment
                </label>
              </fieldset>

              {checkoutError && <p role="alert">{checkoutError}</p>}
              {checkoutMessage && (
                <div className="checkout-success" role="status" aria-live="polite">
                  <span className="checkout-success__icon" aria-hidden="true" />
                  <div>
                    <strong>Order placed successfully</strong>
                    <p>
                      {checkoutMessage === "cod"
                        ? "Payment will be collected on delivery."
                        : "Payment received and your order is confirmed."}
                    </p>
                  </div>
                </div>
              )}

              <button
                type={checkoutMessage ? "button" : "submit"}
                className="btn btn-primary large"
                disabled={checkoutMessage ? false : !cartItems.length || isProcessing}
                onClick={checkoutMessage ? () => navigate("/dashboard") : undefined}
              >
                {checkoutMessage
                  ? "Go back to dashboard"
                  : isProcessing
                    ? "Processing..."
                    : "Place order"}
              </button>
            </form>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
