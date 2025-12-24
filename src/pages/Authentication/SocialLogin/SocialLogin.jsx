import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";


const SocialLogin = () => {
    const navigate = useNavigate();

    const { signInWithGoogle } = useAuth();

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then((result) => {
                navigate("/admin");

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