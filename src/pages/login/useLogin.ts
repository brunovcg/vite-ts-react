import { useTypedNavigate } from "@/router/Router.utils";

export function useLogin() {
  const navigate = useTypedNavigate();
  const handleSubmit = () => navigate("/dashboard/overview");

  //TODO: implement login
  return { handleSubmit };
}
