import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

export function useCurrentUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    picture: "",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const attributes = await fetchUserAttributes();

        setUser({
          name:
            attributes.name ||
            attributes.given_name ||
            "Guest User",
          email: attributes.email || "",
          picture: attributes.picture || "",
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  return user;
}
