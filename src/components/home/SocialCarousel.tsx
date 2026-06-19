import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Instagram, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { keepFrenchPunctuation } from "@/lib/homeUtils";
type SocialPost = {
  id: string;
  image: string;
  type: string;
  title: string;
  meta: string;
  href: string;
  likes: string;
  comments: string;
};
import s from "./SocialCarousel.module.css";

export default function SocialCarousel({ posts }: { posts: SocialPost[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const navGuardRef = useRef(0);

  const scroll = (direction: -1 | 1, force = false) => {
    const now = Date.now();
    if (!force && now - navGuardRef.current < 180) return;
    navGuardRef.current = now;

    const rail = railRef.current;
    if (!rail) return;

    const firstCard = rail.querySelector<HTMLElement>("a");
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || "0") || 0;
    const cardStep = firstCard ? firstCard.getBoundingClientRect().width + gap : 0;
    const step = Math.max(cardStep * 2, rail.clientWidth * 0.6, 260);
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const target = Math.min(maxScroll, Math.max(0, rail.scrollLeft + direction * step));

    rail.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section className={s.socialCarouselSection} aria-labelledby="social-carousel-title">
      <div className={s.socialCarouselHead}>
        <div>
          <span className={s.socialCarouselKicker}>Instagram</span>
          <h2 id="social-carousel-title">Ce qui circule en ce moment.</h2>
        </div>
        <div className={s.socialCarouselActions}>
          <span className={s.socialCarouselCount}>{posts.length} posts</span>
          <div className={s.socialCarouselNav} aria-label="Navigation du carrousel">
            <IconButton
              type="button"
              icon={ChevronLeft}
              aria-label="Précédent"
              variant="outline"
              size="md"
              color="#0A0A0A"
              className={s.socialCarouselButton}
              onPointerDown={(e) => { e.preventDefault(); scroll(-1, true); }}
              onClick={() => scroll(-1)}
            />
            <IconButton
              type="button"
              icon={ChevronRight}
              aria-label="Suivant"
              variant="outline"
              size="md"
              color="#0A0A0A"
              className={s.socialCarouselButton}
              onPointerDown={(e) => { e.preventDefault(); scroll(1, true); }}
              onClick={() => scroll(1)}
            />
          </div>
          <Button as="a" href="https://www.instagram.com/origines.media" variant="outline" size="md" rightIcon={Instagram}>
            Suivre
          </Button>
        </div>
      </div>

      <div ref={railRef} className={s.socialRail} aria-label="Publications Instagram">
        {posts.map((post) => {
          const isCarousel = !post.likes;
          const cardClass = `${s.socialPostCard} ${isCarousel ? s.socialPostCarousel : ""}`;

          const content = (
            <>
              <span className={s.socialPostMedia}>
                <img
                  src={post.image}
                  alt=""
                  width={290}
                  height={362}
                  loading="lazy"
                  decoding="async"
                />
                <span className={s.socialPostType}>{post.type}</span>
              </span>
              {!isCarousel && (
                <span className={s.socialPostBody}>
                  <span className={s.socialPostMeta}>{post.meta}</span>
                  <strong>{keepFrenchPunctuation(post.title)}</strong>
                  <span className={s.socialPostStats}>
                    <span><Heart aria-hidden="true" /> {post.likes}</span>
                    <span><MessageCircle aria-hidden="true" /> {post.comments}</span>
                  </span>
                </span>
              )}
              {isCarousel && (
                <span className={s.socialPostCarouselFooter}>
                  <span>{post.meta}</span>
                  <span>Lire &rarr;</span>
                </span>
              )}
            </>
          );

          return isCarousel ? (
            <Link key={post.id} to={post.href} className={cardClass}>{content}</Link>
          ) : (
            <a key={post.id} href={post.href} className={cardClass}>{content}</a>
          );
        })}
      </div>
    </section>
  );
}
