import { motion } from 'framer-motion';
import { LuMail, LuSend } from 'react-icons/lu';
import { useState } from 'react';

/**
 * NewsletterCTA - Section d'inscription newsletter
 * Design moderne avec animation et formulaire
 */
const NewsletterCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Fond avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-primary opacity-95"></div>

      {/* Éléments décoratifs animés */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-32 -left-32 size-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-32 -right-32 size-96 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Icône animée */}
            <motion.div
              className="inline-flex items-center justify-center size-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-6"
            >
              <LuMail className="size-10 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Restez informé des nouveautés
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-white/90 mb-8 leading-relaxed"
            >
              Inscrivez-vous à notre newsletter et recevez en exclusivité nos offres spéciales,
              nouveautés et conseils mode.
            </motion.p>

            {/* Formulaire */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="w-full px-6 py-4 rounded-full bg-white/95 backdrop-blur-sm text-default-900 placeholder:text-default-500 border-2 border-transparent focus:border-white focus:bg-white focus:ring-4 focus:ring-white/30 transition-all duration-300 outline-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitted}
                  className="px-8 py-4 rounded-full bg-default-900 hover:bg-default-800 text-white font-semibold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitted ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="size-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Envoyé !
                    </>
                  ) : (
                    <>
                      S'inscrire
                      <LuSend className="size-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>

            {/* Message de confirmation animé */}
            {isSubmitted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-white font-medium"
              >
                ✨ Merci ! Vous recevrez bientôt nos meilleures offres.
              </motion.p>
            )}

            {/* Badges de confiance */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-6 mt-8 text-white/80 text-sm"
            >

            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;

