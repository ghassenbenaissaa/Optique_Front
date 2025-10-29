import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import { LuFacebook, LuInstagram, LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { Link } from 'react-router';

const socialLinks = [
  { id: 1, icon: LuFacebook, href: '#', label: 'Facebook' },
  { id: 2, icon: LuInstagram, href: '#', label: 'Instagram' }
];

const footerSections = [
  {
    title: 'Nos Produits',
    links: [
      { label: 'Lunettes de vue', href: '#' },
      { label: 'Lunettes de soleil', href: '#' },
      { label: 'Lentilles de contact', href: '#' },
      { label: 'Accessoires', href: '#' }
    ]
  },
  {
    title: 'Services',
    links: [
      { label: 'Essai virtuel', href: '#' },
      { label: 'Livraison gratuite', href: '#' },
      { label: 'Garantie 2 ans', href: '#' },
      { label: 'Service client', href: '#' }
    ]
  },
  {
    title: 'Informations',
    links: [
      { label: 'À propos', href: '#' },
      { label: 'Nos magasins', href: '#' },
      { label: 'Conditions générales', href: '#' },
      { label: 'Politique de retour', href: '#' }
    ]
  }
];
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-default-50 to-white dark:from-default-900 dark:to-default-900/50 border-t border-default-200 dark:border-default-800">
      {/* Décorations */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full"></div>

      <div className="container relative z-10">
        {/* Section principale */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Logo et description */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-block mb-6">
                <img src={logoDark} alt="Logo" className="h-8 block dark:hidden" />
                <img src={logoLight} alt="Logo" className="h-8 hidden dark:block" />
              </Link>

              <p className="text-default-600 dark:text-default-400 mb-6 leading-relaxed">
                Votre spécialiste en lunettes de vue et de soleil. Qualité, style et expertise à votre service.
              </p>

              {/* Coordonnées */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-sm">
                  <LuMapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-default-600 dark:text-default-400">
                    123 Avenue de la République, Tunis, Tunisie
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <LuPhone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="tel:+21612345678" className="text-default-600 dark:text-default-400 hover:text-primary transition-colors">
                    +216 12 345 678
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <LuMail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a href="mailto:contact@optique.tn" className="text-default-600 dark:text-default-400 hover:text-primary transition-colors">
                    contact@optique.tn
                  </a>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="flex gap-3">
                {socialLinks.map(({ id, icon: Icon, href, label }) => (
                  <a
                    key={id}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-default-800 border border-default-200 dark:border-default-700 text-default-600 dark:text-default-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Sections de liens */}
            {footerSections.map((section, index) => (
              <div key={`footer-section-${index}`} className="lg:col-span-2 md:col-span-1">
                <h5 className="font-semibold text-default-900 dark:text-default-100 mb-4">
                  {section.title}
                </h5>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={`footer-link-${section.title}-${i}`}>
                      <Link
                        to={link.href}
                        className="text-sm text-default-600 dark:text-default-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Horaires d'ouverture */}
            <div className="lg:col-span-2">
              <h5 className="font-semibold text-default-900 dark:text-default-100 mb-4">
                Horaires
              </h5>
              <ul className="space-y-2 text-sm text-default-600 dark:text-default-400">
                <li className="flex justify-between">
                  <span>Lun - Ven</span>
                  <span className="font-medium">9h - 19h</span>
                </li>
                <li className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-medium">9h - 18h</span>
                </li>
                <li className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="font-medium">Fermé</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="py-6 border-t border-default-200 dark:border-default-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-default-600 dark:text-default-400">
            <p>
              © {currentYear} <span className="font-semibold text-default-900 dark:text-default-100">Optique</span>. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="hover:text-primary transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="#" className="hover:text-primary transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
