import { LoginForm, RegisterForm, UpdateProfileForm } from "./UserForms";
import { KitchenForm } from "./KitchenForm";
import { MenuForm } from "./MenuForm";
import { OrderForm } from "./OrderForm";

function FormPreview() {
  return (
    <div className="component-preview">
      <header className="preview-header">
        <p className="eyebrow">Frontend prep</p>
        <h1>Cloud Kitchen form components</h1>
      </header>

      <div className="form-grid">
        <RegisterForm />
        <LoginForm />
        <UpdateProfileForm />
        <KitchenForm />
        <MenuForm />
        <OrderForm />
      </div>
    </div>
  );
}

export default FormPreview;
