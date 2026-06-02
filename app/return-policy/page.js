// The Return Policy page (/return-policy). Static text, so it stays a simple,
// fast page. Edit the wording below to match your actual policy.
export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h2 className="text-3xl font-bold text-zinc-900">Return Policy</h2>

      <div className="mt-6 space-y-5 text-lg leading-relaxed text-zinc-600">
        <p>
          We want you to be happy with every purchase from Shehroz Mobiles and
          Accessories. If something isn&apos;t right, we offer a simple{" "}
          <strong className="text-zinc-900">7 day return policy</strong> &mdash;
          no questions asked.
        </p>
        <p>
          To be eligible for a return, your item should be in its original
          condition and packaging, with all accessories included. Contact us
          within 7 days of receiving your order and we&apos;ll guide you through
          the next steps.
        </p>
        <p>
          Once we receive and check the returned item, we&apos;ll arrange your
          refund or replacement. If you have any questions, please reach out
          through our Contact page &mdash; we&apos;re always happy to help.
        </p>
      </div>
    </main>
  );
}
