export const baseUrl =
    process.env.VERCEL_ENV === "development" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
        ? "http://localhost:3000"
        : "https://ai-writer-app.vercel.app";
