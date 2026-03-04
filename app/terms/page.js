export const metadata = {
  title: 'Terms & Conditions | Dervishi Renovation',
  description: 'Terma dhe kushte për përdorimin e website-it dhe blerjet (membership/produkte dixhitale).',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="prose max-w-3xl dark:prose-invert mt-10">
      <h1>TERMS &amp; CONDITIONS</h1>
      <p><b>Dervishi Renovation</b></p>

      <h2>1. Pranimi i Kushteve</h2>
      <p>
        Duke përdorur këtë website dhe duke blerë membership ose produkte dixhitale, ju pranoni këto Terma dhe Kushte.
      </p>

      <h2>2. Shërbimet</h2>
      <p>Website ofron:</p>
      <ul>
        <li>Membership mujor</li>
        <li>Konsulencë online</li>
        <li>Kurse dhe materiale edukative (PDF, foto, video)</li>
        <li>Informacion mbi shërbimet e rinovimit</li>
      </ul>

      <h2>3. Membership</h2>
      <ul>
        <li>Membership është me pagesë mujore.</li>
        <li>Aksesi është i vlefshëm për periudhën e paguar.</li>
        <li>Benefitet përfshijnë: prioritet shërbimi, konsulta falas gjatë muajit aktiv, akses në përmbajtje ekskluzive.</li>
      </ul>
      <p>Ne rezervojmë të drejtën të modifikojmë përmbajtjen e membership-it.</p>

      <h2>4. Pagesat</h2>
      <ul>
        <li>Të gjitha pagesat janë përfundimtare.</li>
        <li>Nuk ka rimbursim pasi membership-i ose produkti dixhital është aktivizuar.</li>
        <li>Çmimet mund të ndryshojnë pa njoftim paraprak.</li>
      </ul>

      <h2>5. Produktet Dixhitale</h2>
      <ul>
        <li>E-books dhe kurset janë për përdorim personal.</li>
        <li>Ndalohet shpërndarja, rishitja ose kopjimi i përmbajtjes.</li>
      </ul>
      <p>Shkelja e kësaj pike mund të çojë në mbyllje të llogarisë dhe masa ligjore.</p>

      <h2>6. Kërko Ofertë</h2>
      <ul>
        <li>Vetëm anëtarët me membership aktiv mund të kërkojnë ofertë.</li>
        <li>Dërgimi i kërkesës nuk garanton automatikisht pranimin e projektit.</li>
      </ul>

      <h2>7. Review</h2>
      <ul>
        <li>Klientët mund të lënë review reale.</li>
        <li>Dervishi Renovation rezervon të drejtën të heqë komente fyese, të rreme ose të papërshtatshme.</li>
      </ul>

      <h2>8. Përgjegjësia</h2>
      <p>Ne nuk mbajmë përgjegjësi për:</p>
      <ul>
        <li>Vendime që klienti merr bazuar në këshilla online</li>
        <li>Dëme të shkaktuara nga aplikim i gabuar i informacionit</li>
        <li>Probleme teknike jashtë kontrollit tonë</li>
      </ul>

      <h2>9. Ndryshime</h2>
      <p>Ne rezervojmë të drejtën të ndryshojmë këto Terma &amp; Kushte në çdo kohë.</p>

      <h2>10. Ligji i Zbatueshëm</h2>
      <p>Këto kushte rregullohen sipas ligjeve në fuqi të vendit ku operon Dervishi Renovation.</p>
    </div>
  );
}
