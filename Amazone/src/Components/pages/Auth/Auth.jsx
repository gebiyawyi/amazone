import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "../../utility/firebase";
import LayOut from "../../Layout/LayOut";
import styles from "./Signup.module.css";

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match! Please re-enter.");
      setLoading(false);
      return;
    }

    if (isSignUp && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        console.log("User created successfully:", userCredential.user);
        setSuccess("Account created successfully! Welcome to Amazon!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate(from);
        }, 2000);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        console.log("User signed in successfully:", userCredential.user);
        setSuccess("Welcome back! Redirecting...");
        setTimeout(() => {
          navigate(from);
        }, 1500);
      }
      setLoading(false);
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes("auth/user-not-found")) {
        errorMessage =
          "No account found with this email. Please create an account.";
      } else if (errorMessage.includes("auth/wrong-password")) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (errorMessage.includes("auth/email-already-in-use")) {
        errorMessage =
          "Email already in use. Please use a different email or sign in.";
      } else if (errorMessage.includes("auth/weak-password")) {
        errorMessage = "Password should be at least 6 characters.";
      } else if (errorMessage.includes("auth/invalid-email")) {
        errorMessage = "Invalid email address. Please enter a valid email.";
      } else if (errorMessage.includes("auth/too-many-requests")) {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (errorMessage.includes("auth/network-request-failed")) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      console.error("Authentication error:", err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      setSuccess("Google sign-in successful! Redirecting...");
      setTimeout(() => {
        navigate(from);
      }, 1500);
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  const doPasswordsMatch =
    isSignUp && confirmPassword && password === confirmPassword;
  const doPasswordsNotMatch =
    isSignUp && confirmPassword && password !== confirmPassword;

  return (
    <LayOut>
      <div className={styles.container}>
        <div className={styles.signinBox}>
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logoLink}>
              <img
                src="https://thumbs.dreamstime.com/b/amazon-logo-amazon-logo-white-background-vector-format-avaliable-124289859.jpg"
                alt="Amazon"
                className={styles.logo}
              />
            </Link>
          </div>

          <div className={styles.formContainer}>
            <h1>{isSignUp ? "Create Account" : "Sign-In"}</h1>

            {success && <div className={styles.success}>{success}</div>}
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={
                      isSignUp ? "At least 6 characters" : "Enter your password"
                    }
                  />
                  <button
                    type="button"
                    className={styles.showPasswordBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className={styles.formGroup}>
                  <label>Re-enter Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      className={styles.showPasswordBtn}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {doPasswordsMatch && (
                    <small className={styles.match}>✅ Passwords match</small>
                  )}
                  {doPasswordsNotMatch && (
                    <small className={styles.noMatch}>
                      ❌ Passwords do not match
                    </small>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading
                  ? "Please wait..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>

            {!isSignUp && (
              <>
                <div className={styles.agreement}>
                  By signing in you agree to the <strong>AMAZON TERMS</strong>{" "}
                  of use. Use of your personal information is for privacy
                  purposes. See our <strong>Privacy Notice</strong> for more
                  information.
                </div>

                <div className={styles.divider}>
                  <span>New to Amazon?</span>
                </div>

                <button
                  className={styles.createAccountBtn}
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Create your Amazon Account
                </button>
              </>
            )}

            {isSignUp && (
              <div className={styles.switchText}>
                Already have an account?{" "}
                <button
                  className={styles.switchLink}
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Auth;
