import { lazy, Suspense } from "react";

const Footer2Inner = lazy(() => import("./Footer2"));

export default function Footer2() {
  return (
    <Suspense fallback={<footer style={{ minHeight: 200 }} />}>
      <Footer2Inner />
    </Suspense>
  );
}
