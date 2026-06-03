export async function generateRecaptcha(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject('Recaptcha not loaded');
      return;
    }

    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(
          import.meta.env.VITE_RECAPTCHA_SITE_KEY,
          { action }
        );

        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  });
}