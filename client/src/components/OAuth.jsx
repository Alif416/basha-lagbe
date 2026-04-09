import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/users/userSlice";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { FaGoogle } from "react-icons/fa";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    if (!app) {
      alert("Google sign-in is not configured yet. Please use email/password sign in.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/server/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      dispatch(signInSuccess(data));
      navigate("/dashboard/explore");
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 p-3 rounded-xl hover:bg-gray-50 transition font-medium"
    >
      <FaGoogle className="text-red-500" />
      Continue with Google
    </button>
  );
}
