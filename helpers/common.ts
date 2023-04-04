console.log("env", {
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
});

export const baseUrl =
    process.env.VERCEL_ENV === "development" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
        ? "http://localhost:3002"
        : "https://ai-writer-app.vercel.app";
