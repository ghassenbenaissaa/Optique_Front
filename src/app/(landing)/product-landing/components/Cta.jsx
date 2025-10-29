const Cta = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-purple-500/5">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Titre à gauche */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-default-900 dark:text-default-100 mb-2">
              Restez informé de nos nouveautés
            </h2>
            <p className="text-sm text-default-600 dark:text-default-400">
              Inscrivez-vous à notre newsletter
            </p>
          </div>

          {/* Formulaire à droite */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 lg:w-80 px-4 py-3 rounded-lg border border-default-300 dark:border-default-700 bg-white dark:bg-default-800 text-default-900 dark:text-default-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
