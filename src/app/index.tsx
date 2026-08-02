import useRouter from "expo-router";
import React from "react";

export default function Index() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/(tabs)");
  }, [router]);

  return null;
}
``;
