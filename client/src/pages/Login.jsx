import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShoppingBag, ArrowLeft, Mail, KeyRound, Lock } from "lucide-react";

// ── Step components ───────────────────────────────────────

const LoginForm = ({ onForgot }) => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  if (user) { navigate("/"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="auth-logo">
        <ShoppingBag size={28} />
        <span>Shop<em>EZ</em></span>
      </div>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-sub">Sign in to continue shopping</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-pw-wrap">
            <input name="password" type={showPass ? "text" : "password"}
              className="form-input" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
            <button type="button" className="pw-toggle" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
        </div>

        {/* Forgot password link */}
        <div style={{ textAlign: "right", marginTop: -8 }}>
          <button type="button" className="forgot-link" onClick={onForgot}>
            Forgot password?
          </button>
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </>
  );
};

// ── Step 1: Enter email ───────────────────────────────────
const ForgotStep = ({ onNext, onBack }) => {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email!");
      onNext(email);
    } catch (err) {
      toast.error(err.response?.data?.message || "Email not found");
    } finally { setLoading(false); }
  };

  return (
    <>
      <button className="auth-back-btn" onClick={onBack}>
        <ArrowLeft size={16}/> Back to login
      </button>
      <div className="auth-logo">
        <Mail size={28} />
        <span>Reset <em>Password</em></span>
      </div>
      <h1 className="auth-title">Forgot password?</h1>
      <p className="auth-sub">Enter your email and we'll send you a 6-digit OTP</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </>
  );
};

// ── Step 2: Enter OTP + new password ─────────────────────
const ResetStep = ({ email, onBack }) => {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ otp: "", newPassword: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) { toast.error("Passwords don't match"); return; }
    if (form.newPassword.length < 6) { toast.error("Minimum 6 characters"); return; }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", {
        email,
        otp:         form.otp,
        newPassword: form.newPassword,
      });
      toast.success("Password reset! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally { setLoading(false); }
  };

  const resendOTP = async () => {
    setResending(true);
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("New OTP sent!");
    } catch { toast.error("Failed to resend OTP"); }
    finally { setResending(false); }
  };

  return (
    <>
      <button className="auth-back-btn" onClick={onBack}>
        <ArrowLeft size={16}/> Change email
      </button>
      <div className="auth-logo">
        <KeyRound size={28} />
        <span>Enter <em>OTP</em></span>
      </div>
      <h1 className="auth-title">Check your email</h1>
      <p className="auth-sub">
        We sent a 6-digit OTP to <strong style={{color:"var(--text)"}}>{email}</strong>
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">6-Digit OTP</label>
          <input type="text" className="form-input otp-input"
            placeholder="000000" maxLength={6}
            value={form.otp}
            onChange={e => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
            required />
        </div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <div className="input-pw-wrap">
            <input type={showPass ? "text" : "password"} className="form-input"
              placeholder="Min. 6 characters"
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })} required />
            <button type="button" className="pw-toggle" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input type="password" className="form-input" placeholder="Repeat password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })} required />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          <Lock size={15}/> {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="auth-switch">
        Didn't receive OTP?{" "}
        <button className="forgot-link" onClick={resendOTP} disabled={resending}>
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </p>
    </>
  );
};

// ── Main Login page ───────────────────────────────────────
const Login = () => {
  const [step, setStep]   = useState("login"); // login | forgot | reset
  const [email, setEmail] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-card">
        {step === "login"  && <LoginForm onForgot={() => setStep("forgot")} />}
        {step === "forgot" && <ForgotStep onNext={(e) => { setEmail(e); setStep("reset"); }} onBack={() => setStep("login")} />}
        {step === "reset"  && <ResetStep email={email} onBack={() => setStep("forgot")} />}
      </div>
    </div>
  );
};

export default Login;