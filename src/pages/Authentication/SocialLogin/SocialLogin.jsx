import { useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";


const SocialLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';
    const { signInWithGoogle } = useAuth();

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then((result) => {
                navigate(from);

            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="flex justify-center">
            <button
                onClick={handleGoogleSignIn}
                className="btn btn-outline w-full"
            >
                CONTINUE WITH GOOGLE
            </button>
        </div>
    );
};

export default SocialLogin;