import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function WelcomeCard() {
  const navigate = useNavigate();
  const user = useCurrentUser();

  return (
    <div className="rounded-xl bg-white p-8 shadow-md">
      <h1 className="text-3xl font-bold">
        👋 Welcome back, {user.displayName}!
      </h1>

      <p className="mt-2 text-gray-600">
        Ready to ace your next interview?
      </p>

      <Button
        onClick={() => navigate("/create-interview")}
      >
        + Start New Interview
      </Button>
    </div>
  );
}

export default WelcomeCard;
