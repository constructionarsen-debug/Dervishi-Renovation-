import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Kontakt",
  description:
    "Na kontaktoni për renovim apartamentesh, shtëpish dhe ambientesh. Plotësoni formularin dhe ne ju kontaktojmë sa më shpejt.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Kontakt",
    description:
      "Kërkoni shërbime renovimi dhe merrni një përgjigje të shpejtë. Kontakt me email/telefon.",
    url: "/contact",
    images: [{ url: "/og-image-v2.png", width: 1200, height: 630, alt: "Rreth Dervishi Renovation" }],
  },
};

function getMsg(searchParams) {
  const sent = searchParams?.sent;
  const error = searchParams?.error;
  if (sent) return { type: "success", text: "Mesazhi u dërgua me sukses. Do t'ju kontaktojmë sa më shpejt." };
  if (error === "missing") return { type: "error", text: "Ju lutem plotësoni Emër, Email, Numër telefoni dhe Mesazh." };
  if (error === "email") return { type: "error", text: "Email-i nuk është i vlefshëm." };
  if (error === "phone") return { type: "error", text: "Numri i telefonit nuk është i vlefshëm. Përdorni formatin +355… ose +… (EU)." };
  return null;
}

export default function ContactPage({ searchParams }) {
  const msg = getMsg(searchParams);

  return (
    <div className="container-pad py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold">Kontakt</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Plotësoni formularin më poshtë për të kërkuar shërbimet tona të renovimit. Do t’ju përgjigjemi me email ose telefon.
          </p>
        </div>

        {msg ? (
          <div
            className={
              "rounded-2xl border p-4 text-sm shadow-sm " +
              (msg.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
                : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100")
            }
          >
            {msg.text}
          </div>
        ) : null}

        <ContactForm />

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <h2 className="text-lg font-extrabold">Preferoni telefon?</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Mund të na kontaktoni edhe direkt.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div>
              <span className="font-semibold">Telefon:</span>{" "}
              <a className="text-amber-700 hover:underline dark:text-amber-400" href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || "+355696081051"}`}>
                {process.env.NEXT_PUBLIC_CONTACT_PHONE || "+355696081051"}
              </a>
            </div>
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? (
              <div>
                <span className="font-semibold">Email:</span>{" "}
                <a className="text-amber-700 hover:underline dark:text-amber-400" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
