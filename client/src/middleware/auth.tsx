import PendingLoader from "@/components/pendingLoader";
import { useUserData } from "@/hooks/useUserData";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type TChildrenProp = {
  children: ReactNode;
};

export const PublicRouteAccess = ({ children }: TChildrenProp) => {
  const { data, isPending } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.data) {
      navigate("/home", { replace: true });
    }
  }, [data,isPending,navigate]);


  if (isPending) {
    return <PendingLoader />;
  }

  return children;
};

export const ProtectedRouteAccess = ({
  children,
}: TChildrenProp) => {
  const { error, isPending, data } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if ((error || !data?.data)) {
      navigate("/", { replace: true });
    }
  }, [error, navigate, data, isPending]);

  
  if (isPending) {
    return <PendingLoader />;
  }

  return children;
};