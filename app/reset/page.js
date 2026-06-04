import ResetForm from "./ResetForm";

export const dynamic = "force-dynamic";

export default async function ResetPage({ searchParams }) {
  const params = await searchParams;
  return <ResetForm token={params?.token || ""} />;
}
