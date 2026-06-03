import { useEffect, useRef, useState } from 'react';

export default function GoogleReviewsWidget() {
  const ref = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (document.getElementById('sociablekit-script')) {
      return;
    }

    const script = document.createElement('script');

    script.id = 'sociablekit-script';

    script.src =
      'https://widgets.sociablekit.com/google-reviews/widget.js';

    script.defer = true;

    document.body.appendChild(script);

  }, [visible]);

  return (
    <div ref={ref}>
      {visible && (
        <div
          className="sk-ww-google-reviews"
          data-embed-id="25684433"
        />
      )}
    </div>
  );
}