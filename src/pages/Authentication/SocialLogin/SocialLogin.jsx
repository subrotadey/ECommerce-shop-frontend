import useAuth from "../../../hooks/useAuth";


const SocialLogin = () => {

    const { signInWithGoogle } = useAuth();

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then((result) => {
                console.log(result.user);
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