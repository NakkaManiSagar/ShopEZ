import { useState } from "react";
import { User, MapPin, Lock, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState("info");

  const [info, setInfo] = useState({
    name:  user?.name  || "",
    phone: user?.phone || "",
  });
  const [address, setAddress] = useState({
    street:  user?.address?.street  || "",
    city:    user?.address?.city    || "",
    state:   user?.address?.state   || "",
    pincode: user?.address?.pincode || "",
    country: user?.address?.country || "India",
  });
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const saveInfo = async (e) => {
  e.preventDefault();
  if (!info.name.trim()) { toast.error("Name cannot be empty"); return; }
  if (!info.phone.trim()) { toast.error("Phone number cannot be empty"); return; }
  if (info.phone.trim().length < 10) { toast.error("Enter a valid phone number"); return; }
  setSaving(true);
  try {
    const { data } = await API.put("/auth/profile", { name: info.name, phone: info.phone });
    updateUser(data.user);
    toast.success("Profile updated!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  } finally { setSaving(false); }
};

  const saveAddress = async (e) => {
    e.preventDefault();
    const { street, city, state, pincode } = address;
    if (!street.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      toast.error("Please fill in all address fields");
      return;
    }
    setSaving(true);
    try {
      const { data } = await API.put("/auth/profile", { address });
      updateUser(data.user);
      toast.success("Address saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    if (passwords.password.length < 6) { toast.error("Minimum 6 characters"); return; }
    setSaving(true);
    try {
      await API.put("/auth/profile", { password: passwords.password });
      toast.success("Password changed!");
      setPasswords({ password: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally { setSaving(false); }
  };

  const TABS = [
    { key: "info",     label: "Personal Info", icon: <User size={15}/> },
    { key: "address",  label: "Address",       icon: <MapPin size={15}/> },
    { key: "password", label: "Password",      icon: <Lock size={15}/> },
  ];

  return (
    <div className="profile-page container">
      <div className="page-header">
        <h1 className="page-title">My <span>Profile</span></h1>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-avatar-lg">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <p className="profile-name">{user?.name}</p>
          <p className="profile-email">{user?.email}</p>
          {user?.role === "admin" && (
            <span className="badge badge-shipped" style={{ margin: "6px auto 0" }}>Admin</span>
          )}
          <nav className="profile-nav">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`profile-nav-item ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="profile-content">

          {tab === "info" && (
            <form onSubmit={saveInfo} className="profile-form">
              <h3 className="profile-form-title"><User size={18}/> Personal Information</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={info.name}
                  onChange={e => setInfo({ ...info, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user?.email} readOnly
                  style={{ opacity: 0.6, cursor: "not-allowed" }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 XXXXX XXXXX"
                  value={info.phone}
                  onChange={e => setInfo({ ...info, phone: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={15}/> {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {tab === "address" && (
            <form onSubmit={saveAddress} className="profile-form">
              <h3 className="profile-form-title"><MapPin size={18}/> Shipping Address</h3>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-input" placeholder="House no., Street, Area"
                  value={address.street}
                  onChange={e => setAddress({ ...address, street: e.target.value })} />
              </div>
              <div className="profile-fields-2col">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" placeholder="City"
                    value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="form-input" placeholder="State"
                    value={address.state}
                    onChange={e => setAddress({ ...address, state: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-input" placeholder="Pincode"
                    value={address.pincode}
                    onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-input" value={address.country} readOnly
                    style={{ opacity: 0.6 }} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={15}/> {saving ? "Saving..." : "Save Address"}
              </button>
            </form>
          )}

          {tab === "password" && (
            <form onSubmit={savePassword} className="profile-form">
              <h3 className="profile-form-title"><Lock size={18}/> Change Password</h3>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="Min. 6 characters"
                  value={passwords.password}
                  onChange={e => setPasswords({ ...passwords, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" placeholder="Repeat password"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={15}/> {saving ? "Saving..." : "Update Password"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;